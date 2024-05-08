import {useAppContext} from '@/utils/context/AppContext';
import {Box, Center, Heading, Skeleton, useToast} from '@chakra-ui/react';
import '@fontsource/fredoka-one/400.css';
import '@fontsource/roboto/400.css';
import {useEffect, useRef, useState} from 'react';
import './camera.css';

export const Camera: React.FC<{mode: string}> = ({mode}) => {
	const [videoState, setVideoState] = useState(true);
	const [pc, setPC] = useState<RTCPeerConnection>();
	const [dc, setDC] = useState<RTCDataChannel>();
	const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
	const isInit = useRef(false);
	const toast = useToast();
	const {appState, appDispatch} = useAppContext();
	const {videoLoading} = appState;

	const createPeerConnection = async () => {
		const peerConnection = new RTCPeerConnection();

		peerConnection.addEventListener('track', (event) => {
			const processedMediaStream = event.streams[0];
			const videoTracks = processedMediaStream.getVideoTracks();
			const normalMediaStream = new MediaStream();
			normalMediaStream.addTrack(videoTracks[1]);
			setMediaStreams([processedMediaStream, normalMediaStream]);

			setVideoState(true);
		});

		peerConnection.addEventListener('connectionstatechange', () => {
			if (
				peerConnection.connectionState == 'disconnected' ||
				peerConnection.connectionState == 'failed' ||
				peerConnection.connectionState == 'closed'
			) {
				setVideoState(false);
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
					mode
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
		appDispatch({type: 'SET_VIDEO_LOADING', payload: true});
		const peerConnection = await createPeerConnection();
		setPC(peerConnection);
		const dataChannel = peerConnection.createDataChannel('faceData', {
			ordered: true,
			maxPacketLifeTime: 0
		});

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
			mediaStream.getTracks().forEach((track) => {
				// Add main processed video track
				peerConnection.addTrack(track, mediaStream);
			});
			// Add receiver for normal video track
			peerConnection.addTransceiver('video', {direction: 'recvonly'});
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
		appDispatch({type: 'SET_VIDEO_LOADING', payload: false});
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

	useEffect(() => {
		const video = document.getElementById('faceCamera') as HTMLVideoElement;

		if (!video) return;

		if (mediaStreams.length && mode == 'normal') {
			video.srcObject = mediaStreams[1];
		} else {
			video.srcObject = mediaStreams[0];
		}
	}, [mediaStreams, mode]);

	if (videoLoading) {
		return (
			<Center p={6} flex={0.7}>
				<Skeleton w={'100%'} h={'100%'} rounded={5} />
			</Center>
		);
	}

	return (
		<Box flex={0.7}>
			{videoState ? (
				<video id='faceCamera' autoPlay playsInline />
			) : (
				<Center flexDirection={'column'} height={'100%'}>
					<Heading as={'h6'}>Facecam is unavailable</Heading>
					<Box>Make sure that a camera connected to your device and the server is running.</Box>
				</Center>
			)}
		</Box>
	);
};
