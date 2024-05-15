from .db import db, add_prefix_for_prod, environment, SCHEMA
from .room_users import room_users

class Room(db.Model):
    __tablename__ = 'rooms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    room_creator = db.relationship('User', backref='owned_rooms', foreign_keys=[creator_id])
    # users = db.relationship('User', secondary=room_users, back_populates='rooms', lazy='dynamic')
    description = db.Column(db.String(130))


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'creator': self.room_creator.to_dict(),
            'description': self.description,
            # 'active_users': [user.to_dict() for user in self.users]
        }
