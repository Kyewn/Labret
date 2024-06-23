import base64
import os
import pathlib
import cv2 as cv
import json
import asyncio
from aiortc import MediaStreamTrack, RTCSessionDescription, RTCPeerConnection
from aiortc.contrib.media import MediaRelay
from aiohttp import web
import aiohttp_cors
from av import VideoFrame

from api.predict import predict_faces

relay = MediaRelay()
pcs = set()
lock = asyncio.Lock()

serverPath = pathlib.Path(os.path.dirname(os.path.abspath(__file__)))
predictDirPath = serverPath / "predict"

class CameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self, track, mode):
        super().__init__()
        self.track = track
        self.mode = mode
        self.isPredicting = False
        self.predictResult = None

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")

        # Send frame to be processed
        if (not self.isPredicting):
            self.isPredicting = True
            eventLoop = asyncio.get_running_loop()
            eventLoop.create_task(self.predict_img(img))
        
        img = cv.flip(img, 1)

        new_frame = VideoFrame.from_ndarray(img, format='bgr24')
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame
    
    async def predict_img(self, img):
        async with lock:
            if ((self.channel) and (not self.channel.bufferedAmount > 0)):
                imagePredictions = predict_faces([img])

                for objectResults in imagePredictions:
                    for predictResult in objectResults:
                    # Send predict result when face is detected
                        if (predictResult is not None):
                            bestIndex = predictResult.probs.top1
                            bestLabel = predictResult.names[bestIndex] 
                            bestScore = predictResult.probs.top1conf.item()

                            detectedImg = cv.resize(img, (640, 480))
                            detectedImg = cv.flip(img, 1)

                            predictDirPath.mkdir(parents=True, exist_ok=True)
                            cv.imwrite(str(predictDirPath / "detectedFace.png"), detectedImg)
                            with(open(str(predictDirPath / "detectedFace.png"), "rb")) as imgFile:
                                detectedImg = base64.b64encode(imgFile.read()).decode("utf-8")
                                imgFile.close()
                            self.channel.send(json.dumps({"data": {
                                "label": bestLabel,
                                "score": bestScore,
                                "image": detectedImg
                            }}))
            self.isPredicting = False
            # Interval delay to work with recv coroutine
            await asyncio.sleep(3)

async def offer(request):
    try:
        params = await request.json()
        offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

        pc = RTCPeerConnection()
        pcs.add(pc)

        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
                if pc.connectionState == "failed":
                    await pc.close()
                    pcs.discard(pc)

        @pc.on("track")
        def on_track(track):
            if track.kind == "video":
                global local_video
                local_video = CameraTrack(relay.subscribe(track), params["mode"])
                pc.addTrack(local_video)
                
        @pc.on("datachannel")
        def on_datachannel(channel):
            local_video.channel = channel

        # handle offer
        await pc.setRemoteDescription(offer)

        # send answer
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        return  web.Response(
            content_type="application/json",
            text=json.dumps(
                {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
            )
        )
    except Exception as e:
        print(e)
        return web.Response(
            content_type="application/json",
            text = {"error": "An error occurred"}
        )

async def on_shutdown(app):
    # close peer connections
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()

app = web.Application()
app.on_shutdown.append(on_shutdown)
app.router.add_post("/offer", offer)
cors = aiohttp_cors.setup(app, defaults={
            "*": aiohttp_cors.ResourceOptions(allow_credentials=True, expose_headers="*", allow_headers="*")
        })
for route in list(app.router.routes()):
    cors.add(route)
web.run_app(app)