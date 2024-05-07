import {Box, Center, Skeleton, useToast} from '@chakra-ui/react';
import {useEffect, useRef, useState} from 'react';
import './camera.css';

export const FaceCamera: React.FC = () => {
	const [videoState, setVideoState] = useState(true);
	const [pc, setPC] = useState<RTCPeerConnection>();
	const [dc, setDC] = useState<RTCDataChannel>();
	const [loading, setLoading] = useState(false);
	const isInit = useRef(false);
	const toast = useToast();

	const createPeerConnection = async () => {
		const peerConnection = new RTCPeerConnection();

		peerConnection.addEventListener('track', (event) => {
			const video = document.getElementById('faceCamera') as HTMLVideoElement;
			const stream = event.streams[0];

			if (!stream) {
				setVideoState(false);
			} else {
				setVideoState(true);
				video.srcObject = event.streams[0];
			}
		});

		return peerConnection;
	};

	const negotiate = async (peerConnection: RTCPeerConnection) => {
		try {
			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer).then(() => {
				return new Promise<void>((resolve) => {
					if (peerConnection.iceGatheringState === 'complete') {
						resolve();
					} else {
						// eslint-disable-next-line no-inner-declarations
						function checkState() {
							if (peerConnection.iceGatheringState === 'complete') {
								peerConnection.removeEventListener('icegatheringstatechange', checkState);
								resolve();
							}
						}
						peerConnection.addEventListener('icegatheringstatechange', checkState);
					}
				});
			});

			const localDescription = peerConnection.localDescription;
			const response = await fetch('http://localhost:8080/offer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sdp: localDescription?.sdp,
					type: localDescription?.type,
					mode: 'face'
				})
			});
			const remoteAnswer = await response.json();
			return peerConnection.setRemoteDescription(remoteAnswer);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					'Something went wrong while connecting to the camera, please refresh the page and try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	const initializeCameraRTC = async () => {
		setLoading(true);
		const peerConnection = await createPeerConnection();
		setPC(peerConnection);
		const dataChannel = peerConnection.createDataChannel('faceData', {ordered: true});

		dataChannel.onmessage = (event) => {
			// TODO handle detected data sent from the server
			console.log(event.data);
		};
		setDC(dataChannel);

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: {ideal: 1280},
					height: {ideal: 720}
				}
			});
			mediaStream.getTracks().forEach((track) => peerConnection.addTrack(track, mediaStream));
			negotiate(peerConnection);
		} catch {
			toast({
				title: 'Camera permissions denied',
				description: 'Please enable browser permissions for camera and try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!isInit.current) {
			isInit.current = true;
			initializeCameraRTC();
		}
		return () => {
			if (dc) {
				dc.close();
			}

			// close transceivers
			if (pc?.getTransceivers) {
				pc.getTransceivers().forEach(function (transceiver) {
					if (transceiver.stop) {
						transceiver.stop();
					}
				});
			}

			// close local audio / video
			pc?.getSenders().forEach(function (sender) {
				sender.track?.stop();
			});

			// close peer connection
			pc?.close();
		};
	}, []);

	if (loading) {
		return (
			<Center p={6} flex={0.7}>
				<Skeleton w={'100%'} h={'100%'} />
			</Center>
		);
	}

	return (
		<Box flex={0.7}>
			{videoState ? (
				<video id='faceCamera' autoPlay playsInline />
			) : (
				<Box>
					<Box>Face Camera is not available.</Box>
					<Box>Make sure you have a camera connected to your device.</Box>
				</Box>
			)}
		</Box>
	);
};
