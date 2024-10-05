import pathlib
import requests
import shutil
from flask import Blueprint, request, jsonify
from roboflowLabret import rfLabretItemProject
from dotenv import load_dotenv
import os
import cv2 as cv
from api.predict import convertBase64ToCvImage

load_dotenv()

add_item = Blueprint('add_item', __name__)

@add_item.route('/add-item', methods=['POST'])
def addItem():
    data = request.get_json()

    id = data["id"]
    itemName = data["itemName"]
    images = list(data["images"])
    
    # Save images locally first to get path
    # Create folders on init
    # TODO Relocate dir create commands to respective functions
    pathlib.Path('./images').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/new_items').mkdir(parents=True, exist_ok=True)

    uploadedImgInfos = []
    
    # Temporarily write image files locally for upload later 
    for (i, image) in enumerate(images):
        filePath = f"./images/new_items/{id}_{itemName}_{i}.jpg"
        cvImage = convertBase64ToCvImage(image)
    
        # Crop image ROI
        cv.imwrite(filePath, cvImage)

        # Send image to roboflow        
        # Get uploaded image id
        uploadedImg = rfLabretItemProject.single_upload(filePath, tag_names=[id])
        
        # Get image info overview using id
        imageInfoURL = f"https://api.roboflow.com/"\
        f"{os.getenv('ROBOFLOW_WORKSPACE_ID')}/"\
        f"{os.getenv('ROBOFLOW_ITEM_PROJECT_ID')}/"\
        f"images/{uploadedImg.get('image').get('id')}?api_key={os.getenv('ROBOFLOW_API_KEY')}"
        res = requests.get(imageInfoURL)
        imageInfo = res.json()
        uploadedImgInfos.append(imageInfo)

    # Remove temp image files
    shutil.rmtree(pathlib.Path('./images/new_items'))

    return jsonify({
        'message': 'Item added successfully',
        'uploadedImageInfos': uploadedImgInfos
    })