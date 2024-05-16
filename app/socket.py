from flask import session
from flask_socketio import SocketIO, send
from app.models import db, Message
from app import app

socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3333"])

@socketio.on('message')
def handle_message(data):
    message_text = data.get('message')
    room_id = data.get('room_id')

    # Store the message in the database with room information
    new_message = Message(text=message_text, room_id=room_id)
    db.session.add(new_message)
    db.session.commit()

    # Broadcast the message to all clients in the room
    send(message_text, broadcast=True, room=room_id)

if __name__ == '__main__':
    socketio.run(app)
