import os
import pathlib
import shutil
from flask import Blueprint, jsonify
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretFaceProject
from ultralytics import YOLO
from sklearn.model_selection import train_test_split
import cv2 as cv

from api.predict import imageppFace

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
    result = model.train(data=downloadPath, project=f"{serverPath.as_posix()}/train/", name="face", exist_ok=True, workers=0,
                epochs=300,
                patience=100,
                batch=-1, 
                imgsz=640,
                translate=0.3,
                degrees=90,
                hsv_h=0.5,
                hsv_s=0.5,
                hsv_v=0.5,
                seed=42
                )
    
    # Save best model
    shutil.copy2(f"{serverPath.as_posix()}/train/face/weights/best.pt", f"{serverPath.as_posix()}/train/bestFace.pt")
    
    # Get accuracy
    acc_top1 = result.results_dict['metrics/accuracy_top1']

    return jsonify({
        'acc_top1': acc_top1,
        'message': 'Training successful',
    })

# Download face training dataset
def download_face_model_dataset_from_roboflow():
    # Init local folders
    downloadPath.mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    try:
        ltsVersion = rfLabretFaceProject.get_version_information()[0].get("id")[-1]
    except IndexError:
         return jsonify({
            'message': 'VersionNotFoundError',
        })
    rfLTSVersionDataset = rfLabretFaceProject.version(ltsVersion)

    # Remove prev versions from set path
    shutil.rmtree(downloadPath)
    # Download to set path
    rfLTSVersionDataset.download("folder", location=downloadPath.as_posix(), overwrite=True)
    try:
        splitDataset()
    except ValueError:
        return jsonify({
            'message': 'SplitDatasetError',
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

            filePath = trainPath / classDir / image
            cvImage = cv.imread(filePath, cv.IMREAD_ANYCOLOR)
            # Preprocess image and write image to path
            # before splitting
            ppedImage = imageppFace(cvImage)
            cv.imwrite(filePath, ppedImage)

    _, testX, _, testY = train_test_split(images, labels, test_size=0.2, random_state=42, stratify=labels)

    for image, label in zip(testX, testY):
        shutil.move(trainPath / label / image, testPath / label / image)
    # Completed