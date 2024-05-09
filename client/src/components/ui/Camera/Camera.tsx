import {useAppContext} from '@/utils/context/AppContext';
import {Center, Heading, Icon, Skeleton, Text, useToast} from '@chakra-ui/react';
import '@fontsource/fredoka-one/400.css';
import '@fontsource/roboto/400.css';
import {Unplug} from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import './camera.css';

// Normal mode: [NormalStream]
// AI mode: [NormalStream, ProcessedStream]

export const Camera: React.FC<{
	videoId: string;
	mode?: string;
	mediaStreams: MediaStream[] | [];
	setMediaStreams: React.Dispatch<React.SetStateAction<MediaStream[]>>;
	useNormalMode?: boolean;
	normalModeResolution?: MediaTrackConstraints;
	className?: string;
}> = ({
	videoId,
	mode,
	mediaStreams,
	setMediaStreams,
	useNormalMode,
	normalModeResolution,
	className
}) => {
	const [videoState, setVideoState] = useState(true);
	const [pc, setPC] = useState<RTCPeerConnection>();
	const [dc, setDC] = useState<RTCDataChannel>();
	const isInit = useRef(false);
	const toast = useToast();
	const {appState, appDispatch} = useAppContext();
	const {videoLoading} = appState;

	const createPeerConnection = async () => {
		const peerConnection = new RTCPeerConnection();

		peerConnection.addEventListener('track', (event) => {
			// Get processed video stream from server
			const processedMediaStream = event.streams[0];
			// Add processed video stream after original stream
			setMediaStreams((prev) => [...prev, processedMediaStream]);
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
			setVideoState(false);
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

		dataChannel.onerror = (error) => console.log(error);
		dataChannel.onbufferedamountlow = (ev) => console.log(ev);
		dataChannel.onmessage = (event) => {
			// TODO handle detected data sent from the server
			console.log(event.data);
		};
		setDC(dataChannel);

		mediaStreams[0]?.getTracks().forEach((track) => track.enabled && track.stop());
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: {ideal: 1280},
					height: {ideal: 720}
				}
			});
			// First set original stream
			setMediaStreams([mediaStream]);
			mediaStream.getTracks().forEach((track) => {
				// Add main processed video track for processing in server
				peerConnection.addTrack(track, mediaStream);
			});
			negotiate(peerConnection);
		} catch {
			setVideoState(false);
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
		if (useNormalMode) return;

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
		if (useNormalMode) return;

		const video = document.getElementById(videoId) as HTMLVideoElement;

		if (!video) return;

		if (mediaStreams.length && mode == 'normal') {
			video.srcObject = mediaStreams[0];
		} else {
			video.srcObject = mediaStreams[1];
		}
	}, [mediaStreams, mode]);

	useEffect(() => {
		if (!useNormalMode) return;

		appDispatch({type: 'SET_VIDEO_LOADING', payload: true});

		mediaStreams[0]?.getTracks().forEach((track) => track.enabled && track.stop());

		const video = document.getElementById(videoId) as HTMLVideoElement;
		if (!video) return;

		navigator.mediaDevices
			.getUserMedia({
				video: normalModeResolution || {
					width: {ideal: 1280},
					height: {ideal: 720}
				}
			})
			.then((stream) => {
				setMediaStreams([stream]);
				video.srcObject = stream;
			});
		appDispatch({type: 'SET_VIDEO_LOADING', payload: false});
	}, []);

	if (videoLoading) {
		return <Skeleton w={'100%'} h={'100%'} rounded={5} />;
	}

	return (
		<>
			{videoState ? (
				<video id={videoId} className={className || undefined} autoPlay playsInline />
			) : (
				<Center flexDirection={'column'} height={'100%'}>
					<Icon as={Unplug} w={75} h={75} mb={5} />
					<Heading as={'h6'}>Facecam is unavailable</Heading>
					<Text>
						Make sure that a camera is connected to your device and the server is running.
					</Text>
				</Center>
			)}
		</>
	);
};
