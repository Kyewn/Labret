import cv2 as cv

class VideoCapture:
    def __init__(self, mode = ""):
        self.video = cv.VideoCapture(0)
        self.mode = mode

    def __del__(self):
        self.video.release()

    def get_frame(self):
        _, frame = self.video.read()

        # Conditional processing
        if (self.mode == "facial-recognition"):
            frame = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            # Multiple return values
            # return (jpg.tobytes(), {
            #     "key": 69
            # })

        _, jpg = cv.imencode(".jpg", frame)
        return (jpg.tobytes())
