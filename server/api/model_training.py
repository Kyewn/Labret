import pathlib
import shutil
from flask import Blueprint
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretProject

model_training = Blueprint('model_training', __name__)

init_firebase()
firestore_db = firestore.client()
model_training_collection = firestore_db.collection('model_training')

# Download face training dataset
# TODO: Prevent download button if db version == roboflow version 
# NOT A ROUTE, NOW A ROUTE ONLY FOR DEV TEST
@model_training.route('/downloadFaceTrainingDatasetFromRoboflow', methods=['POST'])
def download_face_training_dataset_from_roboflow():
    # Init local folders
    pathlib.Path('./images/faces').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/items').mkdir(parents=True, exist_ok=True)

    # Check firestore if have docs
    docs = model_training_collection.get()
    # If no docs, create new doc with version init to 0
    if len(docs) == 0:
        model_training_collection.add({'version': 1})
        version = 0
    else:
    # If have docs,
    # TODO: Get latest version from roboflow
        version = docs[0].to_dict()['version']
        model_training_collection.document(docs[0].id).update({'version': version + 1})
    
    # Then download dataset from roboflow with version no.
    rfLTSVersion = rfLabretProject.version(version + 1)
    dataset = rfLTSVersion.download("yolov5")
    # Move default dataset download location to custom path
    shutil.move(rf"{dataset.location}", r"./images/faces")