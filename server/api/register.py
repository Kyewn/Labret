import base64
import pathlib
from flask import Blueprint, request, jsonify
from roboflowLabret import rfLabretProject
from api.model_training import download_face_training_dataset_from_roboflow

register = Blueprint('register', __name__)

@register.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    id = data["id"]
    name = data["name"]
    images = list(data["images"])
    
    # Save images locally first to get path
    # Create folders on init
    # TODO Relocate dir create commands to respective functions
    pathlib.Path('./images').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/new_faces').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/new_items').mkdir(parents=True, exist_ok=True)

    for (i, image) in enumerate(images):
        filePath = f"./images/new_faces/{id}_{name}_{i}.jpg"
        bImage = base64.b64decode(image)
        with open(filePath, "wb") as image:
            image.write(bImage)
            image.close()

    # Send image to roboflow
        rfLabretProject.upload(filePath, tag_names=[id])

    return jsonify({'message': 'User registered successfully'})