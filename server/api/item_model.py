from collections import Counter
import os
import pathlib
import shutil
from flask import Blueprint, jsonify, request
import numpy as np
import pandas as pd
import yaml
from firebaseLabret import init_firebase
from firebase_admin import firestore
from roboflowLabret import rfLabretItemProject
from ultralytics import YOLO
from sklearn.model_selection import KFold
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

# KFold value
k = 5
epochs = int(1000 / k)

@item_model.route('/train-item-lts-model')
def train_item_lts_model():
    # Download item training dataset
    download_item_model_dataset_from_roboflow() 

    try:
        fold_yamls = splitDataset()
    except Exception as err:
        print(err)
        return jsonify({
            'message': 'SplitDatasetError',
        })

    # Train model   
    # Using kfolds
    pathlib.Path(f"{serverPath}/train/").mkdir(parents=True, exist_ok=True)
    model = YOLO(f"{serverPath}/yolov8n-seg.pt")
    
    for k in range(len(fold_yamls)):
        data_yaml = fold_yamls[k]
        k_model_performance = model.train(data=data_yaml, project=f"{serverPath.as_posix()}/train/", name="item", exist_ok=True, workers=0,
                    epochs=epochs,
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
        if (k == len(fold_yamls) - 1):
            model_performance = k_model_performance
            
    # Save best model
    shutil.copy2(f"{serverPath.as_posix()}/train/item/weights/best.pt", f"{serverPath.as_posix()}/train/bestItem.pt")

    # Get model performance
    mAP50 = model_performance.results_dict['metrics/mAP50(M)']
    mAP50_95 = model_performance.results_dict['metrics/mAP50-95(M)']

    return jsonify({
        "mAP50": mAP50,
        "mAP50_95": mAP50_95,
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
    
def splitDataset():
    images = sorted(trainImagesPath.rglob("**/*"))
    labels = sorted(trainLabelsPath.rglob("**/*"))
    
    # Get class indexes
    dataset_yaml = downloadPath / "data.yaml"
    with open(dataset_yaml) as file:
        classes = yaml.safe_load(file)['names']
        classIdxs = sorted(classes)
        file.close()
    
    # Create df for class label counting in each label file
    labelStems = [label.stem for label in labels]
    df_labels = pd.DataFrame([], columns=classIdxs, index=labelStems)
    for labelStem in labelStems:
        counter = Counter()
        with open(trainLabelsPath / f"{labelStem}.txt") as file:
            for line in file:
                classIdx = int(line.split()[0])
                counter[classIdx] += 1
            file.close()

        df_labels.loc[labelStem] = counter
    df_labels = df_labels.fillna(0.0)

    # Split data into k fold
    kf = KFold(n_splits=k, shuffle=True, random_state=42)
    kfolds = kf.split(df_labels)
    folds = [f"split_{n}" for n in range(1, k + 1)]
    df_folds = pd.DataFrame(columns=folds, index=labelStems)

    # Populate data role between different splits
    for i, (train, val) in enumerate(kfolds, start=1):
        trainLabels = df_labels.iloc[train].index
        valLabels = df_labels.iloc[val].index

        df_folds[f"split_{i}"].loc[trainLabels] = "train"
        df_folds[f"split_{i}"].loc[valLabels] = "val"

    # Create save path
    export_path = downloadPath / "kfolds"
    export_path.mkdir(parents=True, exist_ok=True) 
    fold_yamls = []
    
    # Create folders for each kfold
    for fold in folds:
        fold_dir = export_path / fold
        fold_dir.mkdir(parents=True, exist_ok=True)
        (fold_dir / "train" / "images").mkdir(parents=True, exist_ok=True)
        (fold_dir / "train" / "labels").mkdir(parents=True, exist_ok=True)
        (fold_dir / "val" / "images").mkdir(parents=True, exist_ok=True)
        (fold_dir / "val" / "labels").mkdir(parents=True, exist_ok=True)

        # Create yaml for fold
        fold_yaml = fold_dir / "data.yaml"
        fold_yamls.append(fold_yaml)
        with open(fold_yaml, "w") as file:
            yaml.safe_dump({
                "path": fold_dir.as_posix(),
                "train": "train",
                "val": "val",
                "names": classes 
            }, file)
            file.close()
    
    # Copy images and labels to each fold
    for image, label in zip(images, labels):
        for fold, task in df_folds.loc[label.stem].items():
            shutil.copy2(image, export_path / fold / task / "images")
            shutil.copy2(label, export_path / fold / task / "labels")

    return fold_yamls
    # Completed
