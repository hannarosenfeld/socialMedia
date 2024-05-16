from flask import Blueprint, jsonify, request
from app.models import db, ChatMessage

chat_message_routes = Blueprint('chat_message', __name__)

@chat_message_routes.route('/chat_messages', methods=['POST'])
def create_chat_message():
    data = request.json
    chat_message = ChatMessage(text=data['text'], room_id=data['room_id'])

    chat_message.user_id = data['user_id']
    db.session.add(chat_message)
    db.session.commit()
    return jsonify({'message': 'Chat message created successfully'}), 201
