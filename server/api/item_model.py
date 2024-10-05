import os
import pathlib
import shutil
from flask import Blueprint, jsonify, request
import numpy as np
import pandas as pd
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretItemProject
from ultralytics import YOLO
from sklearn.model_selection import train_test_split
import cv2 as cv
from api.predict import imageppItem

item_model = Blueprint('item_model', __name__)

init_firebase()
firestore_db = firestore.client()
item_model_collection = firestore_db.collection('item_model')

serverPath = pathlib.Path(os.path.dirname(os.path.dirname(__file__)))
downloadPath = pathlib.Path(os.path.join(os.path.dirname(os.path.dirname(__file__)), "images\\items"))
testImagesPath = downloadPath  / "valid" / "images"
testLabelsPath = downloadPath  / "valid" / "labels"
trainImagesPath = downloadPath / "train" / "images"
trainLabelsPath = downloadPath / "train" / "labels"

@item_model.route('/train-item-lts-model')
def train_item_lts_model():
    # Download item training dataset
    download_item_model_dataset_from_roboflow() 

    # TODO: Choose to freeze and refine instead of restarting from scratch if there is existing model

    # Train model   
    pathlib.Path(f"{serverPath}/train/").mkdir(parents=True, exist_ok=True)
    model = YOLO(f"{serverPath}/yolov8n-seg.pt")
    model.train(data=downloadPath / "data.yaml", project=f"{serverPath.as_posix()}/train/", name="item", exist_ok=True, workers=0,
                epochs=1000,
                patience=500,
                batch=-1,
                lrf=0.01,
                weight_decay= 0.005, 
                imgsz=640,
                translate=0.5,
                degrees=360,
                hsv_h=0.5,
                hsv_v=0.8,
                flipud=0.5,
                seed=42,
                )
    
    # Save best model
    shutil.copy2(f"{serverPath.as_posix()}/train/item/weights/best.pt", f"{serverPath.as_posix()}/train/bestItem.pt")

    return jsonify({
        'message': 'Training successful',
    })

# Download item training dataset
def download_item_model_dataset_from_roboflow():
    # Init local folders
    downloadPath.mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    try: 
        ltsVersion = rfLabretItemProject.get_version_information()[0].get("id")[-1]
    except IndexError:
         return jsonify({
            'message': 'VersionNotFoundError',
        })
    rfLTSVersionDataset = rfLabretItemProject.version(ltsVersion)

    # Remove prev versions from set path
    shutil.rmtree(downloadPath)
    # Download to set path
    rfLTSVersionDataset.download("yolov8", location=downloadPath.as_posix(), overwrite=True)
    try:
        splitDataset()
    except ValueError:
        return jsonify({
            'message': 'SplitDatasetError',
        })
    
def splitDataset():
    # Prepare test folder 
    testImagesPath.mkdir(parents=True, exist_ok=True)
    testLabelsPath.mkdir(parents=True, exist_ok=True)
    
    classIds = set(dirname.split("_")[0] for dirname in os.listdir(trainImagesPath) 
                 if os.path.isfile(trainImagesPath / dirname) and not dirname.startswith('.'))
    images = []
    labels = []

    for classId in classIds:
        classImages = [image for image in os.listdir(trainImagesPath) 
                       if os.path.isfile(trainImagesPath / image) and not image.find(classId) == -1]
        for image in classImages:
            images.append(image)
            labels.append(classId)

            filePath = trainImagesPath / image
            cvImage = cv.imread(filePath, cv.IMREAD_ANYCOLOR)
            # Preprocess image and write image to path
            # before splitting
            ppedImage = imageppItem(cvImage)
            cv.imwrite(filePath, ppedImage)

    _, testImages, _, _ = train_test_split(images, labels, test_size=0.2, random_state=42, stratify=labels)
   
    # class label not needed in object detection folder structure 
    for testImageName in testImages:
        rawName = testImageName.split(".jpg")[0]
        testImageLabel = rawName + ".txt"
        shutil.move(trainImagesPath / testImageName, testImagesPath / testImageName)
        shutil.move(trainLabelsPath / testImageLabel, testLabelsPath / testImageLabel)
    # Completed
