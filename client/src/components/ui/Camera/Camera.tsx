import {getUser} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {User} from '@/utils/data';
import {FaceResult} from '@/utils/utils';
import {Box, Center, Heading, Icon, Skeleton, Text, useToast} from '@chakra-ui/react';
import '@fontsource/fredoka-one/400.css';
import '@fontsource/roboto/400.css';
import {Unplug} from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import './camera.css';

type CenterBoxProps = {
	width: string;
	height: string;
};

// Normal mode: [NormalStream]
// AI mode: [NormalStream, ProcessedStream]

export const Camera: React.FC<{
	videoId: string;
	mode?: string;
	useNormalMode?: boolean;
	mediaResolution?: MediaTrackConstraints;
	className?: string;
	centerBox?: CenterBoxProps;
}> = ({videoId, mode, useNormalMode, mediaResolution, centerBox, className}) => {
	const [videoState, setVideoState] = useState(true);
	const [localDataChannel, setLocalDataChannel] = useState<RTCDataChannel | null>(null);
	const [mDetectedUser, setmDetectedUser] = useState<User | null>(null);
	const [mDetectedUserImageURL, setmDetectedUserImageURL] = useState<string | null>(null);

	const isInit = useRef(false);
	const toast = useToast();
	const {appState, appDispatch} = useAppContext();
	const {detectedUser, detectedUserImageURL, mediaStreams, videoLoading} = appState;

	const createPeerConnection = async () => {
		const peerConnection = new RTCPeerConnection();

		peerConnection.addEventListener('track', (event) => {
			// Get processed video stream from server
			const processedMediaStream = event.streams[0];
			// Add processed video stream after original stream
			appDispatch({type: 'ADD_MEDIA_STREAM', payload: processedMediaStream});
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
		const dataChannel = peerConnection.createDataChannel('faceData', {
			ordered: true,
			maxPacketLifeTime: 0
		});

		dataChannel.onerror = (error) => console.log(error);
		dataChannel.onbufferedamountlow = (ev) => console.log(ev);
		console.log('start');
		setLocalDataChannel(dataChannel);

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: {ideal: 640},
					height: {ideal: 480}
				}
			});

			// First set original stream
			appDispatch({type: 'SET_MEDIA_STREAMS', payload: [mediaStream]});
			mediaStream.getTracks().forEach((track) => {
				// Add main processed video track for processing in server
				peerConnection.addTrack(track, mediaStream);
			});

			negotiate(peerConnection);

			const handleClosePC = () => {
				// Close peer connection associations
				if (dataChannel) {
					// Close data channel
					dataChannel.close();
					setLocalDataChannel(null);
				}

				// close transceivers
				if (peerConnection.getTransceivers) {
					peerConnection.getTransceivers().forEach(function (transceiver) {
						if (transceiver.stop) {
							transceiver.stop();
						}
					});
				}

				// close local audio / video
				peerConnection?.getSenders().forEach(function (sender) {
					sender.track?.stop();
				});
				// close peer connection
				peerConnection.close();
			};

			appDispatch({type: 'SET_CLOSE_EXISTING_PEER_CONNECTION', payload: handleClosePC});
		} catch (error) {
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
		console.log('redo');
		const handleResult = async (event: MessageEvent, mUser: User | null, mURL: string | null) => {
			// FIXME: To finetune
			const face_conf_threshold = 0.95;

			console.log('looping');

			// FIXME: Never update states
			if (mUser && mURL) return;
			console.log('looping1');

			const json = event.data;
			const parsedJson = JSON.parse(
				(json as string).replace(/nan/gi, 'null').replace(/None/g, 'null')
			);
			const {label, score} = parsedJson.data as FaceResult;
			// const {label, image: detectedImage} = parsedJson.data as FaceResult;
			const user = await getUser(label as string);

			// Get saved predicted image from server
			const userImage = await fetch('http://localhost:8000/get-predicted-face').then((res) =>
				res.blob()
			);
			const userImageURL = URL.createObjectURL(userImage);
			if ((score as number) >= face_conf_threshold) {
				console.log('hit');
				setmDetectedUser(user);
				setmDetectedUserImageURL(userImageURL);
			}
		};
		// When required resources ready
		console.log(localDataChannel);
		if (localDataChannel) {
			localDataChannel.onmessage = (event) =>
				handleResult(event, detectedUser, detectedUserImageURL);
		}
	}, [localDataChannel, detectedUser, detectedUserImageURL]);

	useEffect(() => {
		if (mDetectedUser && mDetectedUserImageURL) {
			appDispatch({type: 'SET_DETECTED_USER', payload: mDetectedUser});
			appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: mDetectedUserImageURL});
		}
	}, [mDetectedUser, mDetectedUserImageURL]);

	useEffect(() => {
		if (useNormalMode) return;

		if (!isInit.current) {
			isInit.current = true;
			initializeCameraRTC();
			appDispatch({type: 'SET_OPEN_EXISTING_PEER_CONNECTION', payload: initializeCameraRTC});
		}
	}, []);

	useEffect(() => {
		if (useNormalMode) return;

		const video = document.getElementById(videoId) as HTMLVideoElement;

		if (!video || !mediaStreams) return;

		if (mediaStreams.length && useNormalMode) {
			video.srcObject = mediaStreams[0];
		} else {
			video.srcObject = mediaStreams[1];
		}
	}, [mediaStreams, mode]);

	useEffect(() => {
		if (!useNormalMode) return;

		const video = document.getElementById(videoId) as HTMLVideoElement;
		if (!video) return;

		if (!isInit.current) {
			isInit.current = true;

			appDispatch({type: 'SET_VIDEO_LOADING', payload: true});
			navigator.mediaDevices
				.getUserMedia({
					video: mediaResolution || {
						width: {ideal: 640},
						height: {ideal: 480}
					}
				})
				.then((stream) => {
					const handleCloseCamera = () => {
						stream.getTracks().forEach((track) => {
							track.stop();
						});
					};
					appDispatch({type: 'SET_MEDIA_STREAMS', payload: [stream]});
					appDispatch({type: 'SET_CLOSE_NORMAL_CAMERA', payload: handleCloseCamera});

					video.srcObject = stream;
				});
			appDispatch({type: 'SET_VIDEO_LOADING', payload: false});
		}
	}, []);

	if (videoLoading) {
		return <Skeleton w={'100%'} h={'100%'} rounded={5} />;
	}

	return (
		<>
			{videoState ? (
				<Center w={'100%'} h={'100%'}>
					{!!centerBox && navigator.mediaSession.playbackState && (
						<Box
							position={'absolute'}
							h={centerBox.height}
							w={centerBox.width}
							opacity={0.75}
							border={'5px dashed var(--chakra-colors-lrRed-300)'}
							borderRadius={3}
						/>
					)}
					<video id={videoId} className={className || undefined} autoPlay playsInline muted />
				</Center>
			) : (
				<Center flexDirection={'column'} alignContent={'center'} height={'100%'}>
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
