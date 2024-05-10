from .db import db, add_prefix_for_prod, environment, SCHEMA


room_users = db.Table('room_users',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('room_id', db.Integer, db.ForeignKey('rooms.id'), primary_key=True)
)

if environment == "production":
    room_users.schema = SCHEMA