from flask import Flask
from flask_cors import CORS
from api.register import register

app = Flask(__name__) 
cors = CORS(app, origins="*")

app.register_blueprint(register)

app.run(debug=True, port=8000)
