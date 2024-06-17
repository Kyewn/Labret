from flask import Flask
from flask_cors import CORS
from firebaseLabret import init_firebase
from api.register import register
from server.api.face_model import face_model

app = Flask(__name__) 
cors = CORS(app, origins="*")

init_firebase()

app.register_blueprint(register)
app.register_blueprint(face_model)

app.run(debug=True, port=8000)
