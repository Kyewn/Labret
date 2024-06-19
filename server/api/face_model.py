import os
import pathlib
import shutil
from flask import Blueprint, jsonify, request
import numpy as np
import torch
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretFaceProject
from ultralytics import YOLO
from sklearn.model_selection import train_test_split
import cv2 as cv

face_model = Blueprint('face_model', __name__)

init_firebase()
firestore_db = firestore.client()
face_model_collection = firestore_db.collection('face_model')

serverPath = pathlib.Path(os.path.dirname(os.path.dirname(__file__)))
downloadPath = pathlib.Path(os.path.join(os.path.dirname(os.path.dirname(__file__)), "images\\faces"))

trainPath = pathlib.Path(os.path.join(downloadPath, "train"))
testPath = pathlib.Path(os.path.join(downloadPath, "test"))

@face_model.route('/train-face-lts-model')
def train_face_lts_model():
    # Download face training dataset
    download_face_model_dataset_from_roboflow() 

    # Train model   
    pathlib.Path(f"{serverPath}/train/").mkdir(parents=True, exist_ok=True)
    model = YOLO(f"{serverPath}/yolov8n-cls.pt")
    model.train(data=downloadPath, project=f"{serverPath.as_posix()}/train/", name="face", exist_ok=True, workers=0,
                epochs=300,
                patience=100,
                batch=-1, 
                imgsz=640,
                translate=0.3,
                degrees=90,
                hsv_h=0.5,
                seed=42
                )

    return jsonify({
        'message': 'Training successful',
    })

@face_model.route('/predict-face')
def predict_face():
    # TODO: 
    # Get image
    # - resize it to 640x640
    # - no need crop
    # - preprocess image
    # then supply to predict

    # Load model
    model = YOLO(f"{serverPath}/train/face/weights/best.pt")
    # Predict
    model(os.path.abspath(""), show=True, save=True, imgsz=640, device=0)

    return jsonify({
        'message': 'Prediction successful',
    })

# Download face training dataset
def download_face_model_dataset_from_roboflow():
    # Init local folders
    pathlib.Path('./images').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/faces').mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    ltsVersion = rfLabretFaceProject.get_version_information()[0].get("id")[-1]
    rfLTSVersionDataset = rfLabretFaceProject.version(ltsVersion)

    # Remove prev versions from set path
    shutil.rmtree(downloadPath)
    # Download to set path
    rfLTSVersionDataset.download("folder", location=downloadPath.as_posix(), overwrite=True)
    splitDataset()

# Split dataset into train and test
def splitDataset():
    # Prepare test folder 
    testPath.mkdir(parents=True, exist_ok=True)

    classDirs = [dirname for dirname in os.listdir(trainPath) 
                 if os.path.isdir(os.path.join(trainPath, dirname)) and not dirname.startswith('.')]
    images = []
    labels = []
    for classDir in classDirs:
        classDirPath = trainPath / classDir
        classImages = [image for image in os.listdir(classDirPath) 
                       if os.path.isfile(trainPath / classDir / image) and not image.startswith('.')]
        pathlib.Path(testPath / classDir).mkdir(parents=True, exist_ok=True)
        for image in classImages:
            images.append(image)
            labels.append(classDir)

            filePath = trainPath / classDir / image
            cvImage = cv.imread(filePath, cv.IMREAD_ANYCOLOR)
            # Preprocess image and write image to path
            # before splitting
            imageppFace(cvImage, filePath)
        

    _, testX, _, testY = train_test_split(images, labels, test_size=0.2, random_state=42, stratify=labels)
    for image, label in zip(testX, testY):
        shutil.move(trainPath / label / image, testPath / label / image)
    # Completed

def imageppFace(cvImage, filePath):
    # Face preprocessing
    ksize = 3
    # Sharpen
    image_gray = cv.cvtColor(cvImage, cv.COLOR_BGR2GRAY)
    image_gblur = cv.GaussianBlur(image_gray, (ksize, ksize), 5)

    # Edge detection        
    # Laplacian alot of noise
    # Remove noise with median filter
    image_edge = cv.Laplacian(image_gblur, cv.CV_8U, ksize=5)
    image_edge = cv.medianBlur(image_edge, ksize)
    # Get strong edges
    _, image_thresh = cv.threshold(image_edge , 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    cv.imwrite(filePath, image_thresh)