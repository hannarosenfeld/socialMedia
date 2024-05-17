from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from .db import db

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sender = db.relationship('User', backref='messages_sent')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    def __repr__(self):
        return f'<ChatMessage {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'sender': self.sender.to_dict(),
            'timestamp': str(self.timestamp),  # Convert datetime to string
            'room_id': self.room_id
        }


# Function to delete old messages
from datetime import timedelta

def delete_old_messages():
    # Calculate the timestamp threshold (e.g., messages older than 2 hours)
    threshold = datetime.utcnow() - timedelta(hours=2)
    # Delete messages older than the threshold
    ChatMessage.query.filter(ChatMessage.timestamp < threshold).delete()
    db.session.commit()

# Example usage of delete_old_messages in a scheduled job (e.g., using APScheduler)
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.add_job(delete_old_messages, 'interval', hours=2)
scheduler.start()
