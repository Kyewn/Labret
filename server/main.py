from flask import Flask, Response
from camera import VideoCapture

app = Flask(__name__) 

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield(b'--frame\r\n'
              b'Content-Type: image/jpeg\r\n\r\n' + frame +
              b'\r\n\r\n')

@app.route('/')
def video():
    return Response(gen(VideoCapture()), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/facial-recognition')
def videoFr():
    return Response(gen(VideoCapture("facial-recognition")), mimetype='multipart/x-mixed-replace; boundary=frame')

app.run(host='0.0.0.0', port=5000, threaded=True, use_reloader=False)