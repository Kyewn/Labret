from roboflow import Roboflow

rf = Roboflow(api_key="eNtkPf937uJfxwVp8Eka")
workspaceId = "oowus-workspace"
projectId = "labret"

rfLabretProject = rf.workspace(workspaceId).project(projectId)