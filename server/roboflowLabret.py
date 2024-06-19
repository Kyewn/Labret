from roboflow import Roboflow
from dotenv import load_dotenv
import os

load_dotenv()

rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
workspaceId = os.getenv("ROBOFLOW_WORKSPACE_ID")
faceProjectId = os.getenv("ROBOFLOW_FACE_PROJECT_ID")
itemProjectId = os.getenv("ROBOFLOW_ITEM_PROJECT_ID")

rfLabretFaceProject = rf.workspace(workspaceId).project(faceProjectId)
rfLabretItemProject = rf.workspace(workspaceId).project(itemProjectId)