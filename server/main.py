from flask import Flask
from flask_cors import CORS
from firebaseLabret import init_firebase
from api.register import register
from api.add_item import add_item
from api.face_model import face_model, train_face_lts_model
from api.item_model import item_model, train_item_lts_model
from api.predict import predict, predict_items
from api.imagekit import imagekit

app = Flask(__name__) 
cors = CORS(app, origins="*")

init_firebase()

app.register_blueprint(register)
app.register_blueprint(add_item)
app.register_blueprint(face_model)
app.register_blueprint(item_model)
app.register_blueprint(predict)
app.register_blueprint(imagekit)

app.run(debug=True, port=8000)

