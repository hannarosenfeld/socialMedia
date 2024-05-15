from flask import Blueprint, jsonify, request
from app.models import Room, User, db
from app.forms import RoomForm
from flask_login import current_user, login_required
from sqlalchemy import func

room_routes = Blueprint('rooms', __name__)

@room_routes.route('/')
# @login_required
def rooms():
    """
    Query for all rooms and returns them in a list of room dictionaries
    """
    rooms = Room.query.all()
    return [room.to_dict() for room in rooms]

@room_routes.route('/<int:id>')
# @login_required
def room(id):
    """
    Query for a room by id and returns that room in a dictionary
    """
    room = Room.query.get(id)
    return room.to_dict()


@room_routes.route('/', methods=['POST'])
# @login_required
def create_room():
    """
    Creates a new room
    """
    form = RoomForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        room = Room(
            name=form.data['name'],
            description=form.data['description'],
            room_creator=current_user
        )
        db.session.add(room)
        db.session.commit()
        return room.to_dict()
    return {'errors': form.errors}, 401


@room_routes.route('/<string:name>', methods=['PUT'])
# @login_required
def enter_room_by_name(name):
    """
    Enter room by name
    """
    data = request.json
    room_name = data['room_name'].lower()
    user_id = data['user_id']
    
    room = Room.query.filter(func.lower(Room.name) == room_name).first()

    if not room:
        return jsonify({'error': 'Room not found'}), 404
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'user': user.to_dict(),
        'room': room.to_dict()
    })

