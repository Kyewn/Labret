from flask import Blueprint, request, jsonify

register = Blueprint('register', __name__)

@register.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Save images to flask server (image and model training server)
    
    # TODO Send to roboflow via CLI in flask server

    return jsonify({'message': 'User registered successfully'})