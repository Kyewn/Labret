from roboflow import Roboflow
from dotenv import load_dotenv
import os

load_dotenv()

rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
workspaceId = os.getenv("ROBOFLOW_WORKSPACE_ID")
projectId = os.getenv("ROBOFLOW_PROJECT_ID")

rfLabretProject = rf.workspace(workspaceId).project(projectId)