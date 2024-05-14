from flask import Blueprint, jsonify, request
from app.models import Room, db
from app.forms import RoomForm
from flask_login import current_user, login_required

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
        print("💖 new room: ", form)
        db.session.add(room)
        db.session.commit()
        return room.to_dict()
    return {'errors': form.errors}, 401
