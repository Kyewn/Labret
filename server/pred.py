import os
from ultralytics import YOLO
from server.api.face_model import splitDataset
# from api.face_model import train_face_lts_model

# train_face_lts_model()
# set IOU thresh when using pred() func later in route api
# face use classification
# item use object detect
# splitDataset()

serverPath = os.path.dirname(__file__)
model = YOLO(f"{serverPath}/train/face/weights/best.pt")
model(os.path.abspath("C:/Users/brian/Desktop/face.jpg"), show=True, save=True, imgsz=640, device=0)