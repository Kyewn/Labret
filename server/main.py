from flask import Flask
from flask_cors import CORS
from firebaseLabret import init_firebase
from api.register import register
from api.face_training import face_training

app = Flask(__name__) 
cors = CORS(app, origins="*")

init_firebase()

app.register_blueprint(register)
app.register_blueprint(face_training)

app.run(debug=True, port=8000)
