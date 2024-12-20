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

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        img = cv.flip(img, 1)
        new_frame = VideoFrame.from_ndarray(img, format='bgr24')
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame

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