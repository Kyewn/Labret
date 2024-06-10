import base64
import pathlib
import requests
import shutil
from flask import Blueprint, request, jsonify
from roboflowLabret import rfLabretFaceProject
from dotenv import load_dotenv
import os

load_dotenv()

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

    uploadedImgInfos = []
    
    # Temporarily write image files locally for upload later 
    for (i, image) in enumerate(images):
        filePath = f"./images/new_faces/{id}_{name}_{i}.jpg"
        bImage = base64.b64decode(image)
        with open(filePath, "wb") as image:
            image.write(bImage)
            image.close()

        # Send image to roboflow        
        # Get uploaded image id
        uploadedImg = rfLabretFaceProject.single_upload(filePath, tag_names=[id])
        
        # Get image info overview using id
        imageInfoURL = f"https://api.roboflow.com/"\
        f"{os.getenv("ROBOFLOW_WORKSPACE_ID")}/"\
        f"{os.getenv("ROBOFLOW_FACE_PROJECT_ID")}/"\
        f"images/{uploadedImg.get("image").get("id")}?api_key={os.getenv("ROBOFLOW_API_KEY")}"
        res = requests.get(imageInfoURL)
        imageInfo = res.json()
        uploadedImgInfos.append(imageInfo)

    # Remove temp image files
    shutil.rmtree(pathlib.Path('./images/new_faces'))
    shutil.rmtree(pathlib.Path('./images/new_items'))

    return jsonify({
        'message': 'User registered successfully',
        'uploadedImageInfos': uploadedImgInfos
    })