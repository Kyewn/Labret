import json
import os
import firebase_admin
from firebase_admin import credentials

def get_service_account_json():
    with open(os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")) as file:
        data = json.load(file)
        file.close()
    return data

def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(get_service_account_json())
        firebase_admin.initialize_app(cred)