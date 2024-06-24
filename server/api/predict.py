import base64
import os
import pathlib
from flask import Blueprint, request, jsonify, send_file
import numpy as np
from ultralytics import YOLO
from dotenv import load_dotenv
import cv2 as cv

load_dotenv()

predict = Blueprint('predict', __name__)

serverPath = pathlib.Path(os.path.dirname(os.path.dirname(__file__)))
predictDirPath = serverPath / "predict"

face_conf_threshold = 0.9

@predict.route('/predict-face', methods=['POST'])
def predict_face_api():
    data = request.get_json()
    
    # Supply list in request for future multi image prediction
    images = list(data["images"])
    cvImages = [convertBase64ToCvImage(image) for image in images]
    
    # Predict
    imagePredictions = predict_faces(cvImages)

    # Return result if any 
    for objectResults in imagePredictions:
        labels = []
        scores = []
        for predictResult in objectResults:
            if (predictResult is not None):
                bestIndex = predictResult.probs.top1
                bestLabel = predictResult.names[bestIndex] 
                bestScore = predictResult.probs.top1conf.item()

                labels.append(bestLabel)
                scores.append(bestScore)

        return jsonify({
            "data": {
                "labels": labels,
                "scores": scores,
            },
            'message': 'Prediction successful',
        })
        
    # All empty results - Failed
    return jsonify({
        'message': 'Prediction failed, did not give any results',
    })

@predict.route('/get-predicted-face')
def get_predicted_face():
    filename = predictDirPath / "detectedFace.png"
    return send_file(filename, mimetype='image/png')

def predict_faces(cvImages):
    # modelPath = f"{serverPath}/train/face/weights/best.pt"
    modelPath = serverPath / "train" / "face" / "weights" / "best.pt"
    # Return null if no model
    if (not modelPath.exists()):
        return None

    ppImages = []
    predictResults = []

    # Load model
    model = YOLO(modelPath)
    for cvImage in cvImages:
        cvImage = cv.resize(cvImage, (640, 640))
        cvImage = imageppFace(cvImage)
        ppImages.append(cvImage)    

    # Predict
    for ppImage in ppImages:
        ppImageCompat = cv.cvtColor(ppImage, cv.COLOR_GRAY2BGR)

        parsedResults = []
        results = model.predict(ppImageCompat, imgsz=640, device=0)
        for result in results:
            # Filter out low confidence predictions
            if (result.probs.top1conf >= face_conf_threshold):
                parsedResults.append(result)
            else:
                parsedResults.append(None)
        predictResults.append(parsedResults)

    return predictResults

def imageppFace(cvImage):
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
    # TODO
    # cv.imshow("image_gblur", image_gblur)

    # cv.imshow("image_edge", image_edge)
    # Get strong edges
    _, image_thresh = cv.threshold(image_edge, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    

    return image_thresh

def convertBase64ToCvImage(base64Image):
    bImage = base64.b64decode(base64Image)
    cvImage = np.fromstring(bImage, dtype=np.uint8)
    cvImage = cv.imdecode(cvImage, cv.IMREAD_ANYCOLOR)
    return cvImage