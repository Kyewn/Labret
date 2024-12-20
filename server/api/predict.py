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

face_conf_threshold = 0.7

@predict.route('/predict-face', methods=['POST'])
def predict_face_api():
    modelPath = serverPath / "train" / "bestFace.pt"
    # Return null if no model
    if (not modelPath.exists()):
        return jsonify({
        'message': 'Prediction failed, did not give any results',
    })

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

# @predict.route('/get-predicted-face')
# def get_predicted_face_image():
#     filename = predictDirPath / "detectedFace.png"
#     return send_file(filename, mimetype='image/png')

def predict_faces(cvImages):
    modelPath = serverPath / "train" / "bestFace.pt"

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
        # ppImageCompat = cv.cvtColor(ppImage, cv.COLOR_GRAY2BGR)

        parsedResults = []
        # results = model.predict(ppImageCompat, imgsz=640, device=0)
        results = model.predict(ppImage, imgsz=640, device=0)
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
    # Color quantization
    # kmeansN = 50 
    # image_gray = cv.cvtColor(cvImage, cv.COLOR_BGR2GRAY)
    # image_gray = cv.medianBlur(image_gray, 7)

    # image_kmeans = image_gray.reshape(-1).astype(np.float32)
    # criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    # _, labels, centers = cv.kmeans(image_kmeans, kmeansN, None, criteria, 10, cv.KMEANS_RANDOM_CENTERS)
    # image_quantized = centers[labels.flatten()].reshape(image_gray.shape).astype(np.uint8)
    # image_final = cv.cvtColor(image_quantized , cv.COLOR_GRAY2BGR)
    # Sharpen
    image_gray = cv.cvtColor(cvImage, cv.COLOR_BGR2GRAY)
    image_median = cv.medianBlur(image_gray, 9)

    # Edge detection        
    # Laplacian alot of noise
    image_edge = cv.Laplacian(image_median, cv.CV_8U, ksize=5)

    # Get strong edges
    _, image_thresh = cv.threshold(image_edge, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
    image_blank = np.zeros_like(image_thresh)
    contours = cv.findContours(image_thresh, cv.RETR_CCOMP , cv.CHAIN_APPROX_SIMPLE)
    #Filter blob areas < 2 pixels
    strongBlobs = [contour for contour in contours[0] if cv.contourArea(contour) > 2]
    image_strongBlobs = cv.drawContours(image_blank, strongBlobs, -1, (255, 255, 255), -1)
    image_final = cv.cvtColor(image_strongBlobs , cv.COLOR_GRAY2BGR)
    
    return image_final

@predict.route('/predict-item', methods=['POST'])
def predict_item_api():
    modelPath = serverPath / "train" / "bestItem.pt"
    # Return null if no model
    if (not modelPath.exists()):
        return jsonify({
        'message': 'Prediction failed, did not give any results',
    })
    
    data = request.get_json()

    # Supply list in request for future multi image prediction
    images = list(data["images"])
    cvImages = [convertBase64ToCvImage(image) for image in images]
    
    # Predict
     # Structure: {
    #     "label": count,
    # }
    item_list = predict_items(cvImages)

    # If any results
    if (len(item_list.keys()) > 0):
        return jsonify({
            'data': item_list,
            'message': 'Prediction successful',
        })
        
    # no results - Failed
    return jsonify({
        'message': 'Prediction failed, did not give any results',
    })

def predict_items(cvImages):
    modelPath = serverPath / "train" / "bestItem.pt"

    ppImages = []

    # Load model
    model = YOLO(modelPath)
    for cvImage in cvImages:
        cvImage = cv.resize(cvImage, (640, 640))
        cvImage = imageppItem(cvImage)
        ppImages.append(cvImage)    
    
    # Predict
    parsed_item_list = {}
    results = model.predict(ppImages, imgsz=640, device=0, conf=0.3)
    for (i, result) in enumerate(results):
        names = result.names
        raw_item_list = result.boxes.cpu().data.numpy()
        # plotted_img = result.plot(line_width=1, font_size=1)

        for item in raw_item_list:
            detectedItemId = names[item[-1]]
            # if item initially detected
            if detectedItemId not in parsed_item_list.keys():
                parsed_item_list[detectedItemId] = {
                    "count": 1,
                    "proof": i
                }
            else:
            # if item already detected
                parsed_item_list[detectedItemId].update({"count": parsed_item_list[detectedItemId]["count"] + 1})

    
    return parsed_item_list

def imageppItem(cvImage):
    # Item preprocessing
    image_median = cv.medianBlur(cvImage, 7)
    image_final = image_median
    return image_final

def convertBase64ToCvImage(base64Image):
    bImage = base64.b64decode(base64Image)
    cvImage = np.fromstring(bImage, dtype=np.uint8)
    cvImage = cv.imdecode(cvImage, cv.IMREAD_ANYCOLOR)
    return cvImage