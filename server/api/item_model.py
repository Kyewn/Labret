import os
import datetime
from collections import Counter
import pathlib
import shutil
from flask import Blueprint, jsonify, request
import numpy as np
import pandas as pd
import yaml
import torch
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretItemProject
from ultralytics import YOLO
from sklearn.model_selection import KFold
import cv2 as cv

item_model = Blueprint('item_model', __name__)

init_firebase()
firestore_db = firestore.client()
item_model_collection = firestore_db.collection('item_model')

serverPath = pathlib.Path(os.path.dirname(os.path.dirname(__file__)))
downloadPath = pathlib.Path(os.path.join(os.path.dirname(os.path.dirname(__file__)), "images\\items"))

yamlPath = downloadPath / "data.yaml"
kfoldPath = downloadPath / "kfold"

@item_model.route('/train-item-lts-model')
def train_item_lts_model():
    # Download item training dataset
    download_item_model_dataset_from_roboflow() 

    # Train model   
    pathlib.Path(f"{serverPath}/train/").mkdir(parents=True, exist_ok=True)
    model = YOLO(f"{serverPath}/yolov8n-cls.pt")
    model.train(data=downloadPath, project=f"{serverPath.as_posix()}/train/", name="item", exist_ok=True, workers=0,
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

@item_model.route('/predict-item')
def predict_item():
    # TODO: 
    # Get image
    # - resize it to 640x640
    # - no need crop
    # - preprocess image
    # then supply to predict

    # Load model
    model = YOLO(f"{serverPath}/train/item/weights/best.pt")
    # Predict
    model(os.path.abspath(""), show=True, save=True, imgsz=640, device=0)

    return jsonify({
        'message': 'Prediction successful',
    })

# Download item training dataset
def download_item_model_dataset_from_roboflow():
    # Init local folders
    pathlib.Path('./images').mkdir(parents=True, exist_ok=True)
    pathlib.Path('./images/items').mkdir(parents=True, exist_ok=True)
   
    # Get dataset from roboflow with lts version no.
    ltsVersion = rfLabretItemProject.get_version_information()[0].get("id")[-1]
    rfLTSVersionDataset = rfLabretItemProject.version(ltsVersion)

    # Remove prev versions from set path
    shutil.rmtree(downloadPath)
    # Download to set path
    rfLTSVersionDataset.download("yolov8", location=downloadPath.as_posix(), overwrite=True)
    splitDataset()

def splitDataset():
    # Constant
    ksplit = 5

    classes = readClasses()
    classIds = sorted(classes.keys())
    labels = sorted(downloadPath.rglob("*labels/*.txt"))
    labelFileNames = [label.stem for label in labels]
    # Counters for labels in each file
    dfLabels = pd.DataFrame([], columns=classIds, index=labelFileNames)
    dfLabels = readLabels(labels, dfLabels)

    # Init kfold
    kfold = KFold(n_splits=ksplit, shuffle=True, random_state=42)
    kfolds = list(kfold.split(dfLabels))

    # Create kfold folders
    kfoldPath.mkdir(parents=True, exist_ok=True)
    kfSplitYamls = []

    # Load full image dataset 
    images = sorted(downloadPath.rglob("*images/*"))

    for split in range(1, ksplit+1):
        splitPath = kfoldPath / f"split_{split}"
        trainImagesPath = splitPath  / "train" / "images"
        trainLabelsPath = splitPath / "train" / "labels"
        valImagesPath = splitPath / "val" / "images"
        valLabelsPath = splitPath / "val" / "labels"

        # Recreate kfold folders 
        shutil.rmtree(splitPath)
        splitPath.mkdir(parents=True, exist_ok=True)
        trainImagesPath.mkdir(parents=True, exist_ok=True)
        trainLabelsPath.mkdir(parents=True, exist_ok=True)
        valImagesPath.mkdir(parents=True, exist_ok=True)
        valLabelsPath.mkdir(parents=True, exist_ok=True)

        splitYamlPath = splitPath / "data.yaml"
        kfSplitYamls.append(splitYamlPath)

        # Create split yaml file
        with open(splitYamlPath, "w") as yamlFile:
            yaml.safe_dump(
                {
                    "path": splitPath.as_posix(),
                    "train": "train",
                    "val": "val",
                    "names": classes
                }, 
                yamlFile
            )
            yamlFile.close()

        for (train, val) in kfolds:
            trainImages = images[train]
            trainLabels = labels[train]
            valImages = images[val]
            valLabels = labels[val]

            # Copy image and label files to new directory
            for (image, label) in zip(trainImages, trainLabels):
                shutil.copy(image, trainImagesPath / image)
                shutil.copy(label, trainLabelsPath / label)

            for (image, label) in zip(valImages, valLabels):
                shutil.copy(image, valImages / image)
                shutil.copy(label, valLabels / label)


def readClasses():
    with open(yamlPath, 'r', encoding="utf8") as yamlFile:
        classes = yaml.safe_load(yamlFile)["names"]
        yamlFile.close()
    return classes

def readLabels(labelFiles, dfLabels):
    idfLabels = dfLabels.copy()
    for labelFile in labelFiles:
        ctrLabel = Counter()

        with open(labelFile, 'r') as f:
            lines = f.readlines()
            f.close()

        for line in lines:
            # Increment count at found label index
            labelId = int(line.split(" ")[0])
            ctrLabel[labelId] += 1
            
        idfLabels.loc[labelFile.stem] = ctrLabel
  
    idfLabels = idfLabels.fillna(0)
    return idfLabels

def imageppItem(cvImage, filePath):
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