import os
import pathlib
import shutil
from flask import Blueprint, request
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretProject

model_training = Blueprint('model_training', __name__)

init_firebase()
firestore_db = firestore.client()
model_training_collection = firestore_db.collection('model_training')

# Download face training dataset
# part of the training process, NOT A ROUTE, NOW A ROUTE ONLY FOR DEV TEST
@model_training.route('/downloadFaceTrainingDatasetFromRoboflow', methods=['POST'])
def download_face_training_dataset_from_roboflow():
    # Init local folders
    pathlib.Path('./images/faces').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/items').mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    ltsVersion = rfLabretProject.get_version_information()[-1].get("id")[-1::]
    rfLTSVersionDataset = rfLabretProject.version(ltsVersion)

    # Only download dataset if it doesn't exist
    if (not os.path.isdir(f"./images/faces/Labret-{ltsVersion}")):
        # Download and Move default dataset download location to custom path
        dataset = rfLTSVersionDataset.download("yolov5")
        shutil.move(rf"{dataset.location}", r"./images/faces")