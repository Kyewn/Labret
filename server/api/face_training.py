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

face_training = Blueprint('face_training', __name__)

init_firebase()
firestore_db = firestore.client()
face_training_collection = firestore_db.collection('face_training')

serverPath = pathlib.Path(os.path.dirname(os.path.dirname(__file__)))
downloadPath = pathlib.Path(os.path.join(os.path.dirname(os.path.dirname(__file__)), "images\\faces"))

trainPath = pathlib.Path(os.path.join(downloadPath, "train"))
testPath = pathlib.Path(os.path.join(downloadPath, "test"))

# Download face training dataset
def download_face_training_dataset_from_roboflow():
    # Init local folders
    pathlib.Path('./images/faces').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/items').mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    ltsVersion = rfLabretFaceProject.get_version_information()[0].get("id")[-1]
    rfLTSVersionDataset = rfLabretFaceProject.version(ltsVersion)

    # Remove prev versions from set path
    shutil.rmtree(downloadPath)
    # Download to set path
    rfLTSVersionDataset.download("folder", location=downloadPath.as_posix(), overwrite=True)
    splitDataset()

@face_training.route('/train-face-lts-model')
def train_face_lts_model():
    # Download face training dataset
    download_face_training_dataset_from_roboflow() 

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

    #TODO needs preprocessing before splitting

    _, testX, _, testY = train_test_split(images, labels, test_size=0.2, random_state=42, stratify=labels)
    for image, label in zip(testX, testY):
        shutil.move(trainPath / label / image, testPath / label / image)
    # Completed

# TODO for object detection? incomplete
# def splitDataset():
#     # Prepare test folder 
#     pathlib.Path(testPath).mkdir(parents=True, exist_ok=True)
#     pathlib.Path(testImagesPath).mkdir(parents=True, exist_ok=True)
#     pathlib.Path(testLabelsPath).mkdir(parents=True, exist_ok=True)
#     originalImages = os.listdir(trainImagesPath)
#     originalLabels = os.listdir(trainLabelsPath)
#     originalLabels = [readLabel(label) for label in originalLabels]
#     print(originalLabels)
#     # shuffledIndexes = np.arange(len(originalImages))

#     # np.random.seed(42)
#     # np.random.shuffle(shuffledIndexes)
#     # trainIndexes, testIndexes = np.split(shuffledIndexes, [int(0.8 * len(shuffledIndexes))])
#     # trainImages = np.array(originalImages)[trainIndexes]
#     # testImages = np.array(originalImages)[testIndexes]
#     # trainLabels = np.array(originalLabels)[trainIndexes]
#     # testLabels = np.array(originalLabels)[testIndexes]

#     # for image in trainImages:
#     #     shutil.move(os.path.join(testImagesPath, image), os.path.join(trainImagesPath, image))

#     # for image in testImages:
#     #     shutil.move(os.path.join(trainImagesPath, image), os.path.join(testImagesPath, image))

#     # for label in trainLabels:
#     #     shutil.move(os.path.join(testLabelsPath, label), os.path.join(trainLabelsPath, label))

#     # for label in testLabels:
#     #     shutil.move(os.path.join(trainLabelsPath, label), os.path.join(testLabelsPath, label))

# def readLabel(filename):
#     with open(filename, 'r') as f:
#         content = f.read()
#         label = content.split(" ")[0]
#         f.close()
#     return label