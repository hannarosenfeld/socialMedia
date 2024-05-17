import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, ChatMessage
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.room_routes import room_routes
from .seeds import seed_commands
from .config import Config
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(room_routes, url_prefix='/api/rooms')

# Initialize Socket.IO with CORS support
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3333")

@socketio.on('join_room')
def handle_join_room(data):
    room_name = data['room']
    join_room(room_name)
    socketio.emit('user_joined', {'msg': f"User has joined the room {room_name}"}, room=room_name)

@socketio.on('send_message')
def handle_send_message(data):
    room_name = data['roomName']
    content = data['content']
    sender_id = data['senderId']
    room_id = data['roomId']

    # Retrieve the User instance based on the sender_id
    sender = User.query.get(sender_id)

    if sender:
        # Ensure that the sender is a valid user
        new_message = ChatMessage(content=content, room_id=room_id, sender=sender)
        db.session.add(new_message)
        db.session.commit()

        socketio.emit('receive_message', {
            'message': new_message.to_dict()
        }, room=room_name)
    else:
        print("Invalid sender ID:", sender_id)

db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app, origins=['http://localhost:3333'])

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

@app.route("/api/docs")
def api_help():
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin()
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True)
