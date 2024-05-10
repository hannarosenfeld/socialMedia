from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import Room

room_routes = Blueprint('rooms', __name__)

@room_routes.route('/')
# @login_required
def rooms():
    """
    Query for all rooms and returns them in a list of room dictionaries
    """
    print("🍔")
    rooms = Room.query.all()
    print("🔥", rooms)
    return jsonify([room.to_dict() for room in rooms])

@room_routes.route('/<int:id>')
# @login_required
def room(id):
    """
    Query for a room by id and returns that room in a dictionary
    """
    room = Room.query.get(id)
    return room.to_dict()

