import {FaceLogin} from '@/components/main_menu/FaceLogin';
import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {UserMenu} from '@/components/main_menu/UserMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {getUser} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {User} from '@/utils/data';
import {predictFaces} from '@/utils/utils';
import {Box, Center, Flex, Image} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';

const face_conf_threshold = 0.7;

export function MainMenu() {
	const {appState, appDispatch} = useAppContext();
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const {user, detectedUser, detectedUserImageURL, mediaStreams} = appState;

	useEffect(() => {
		const handlePredictFace = async (
			streams: MediaStream[],
			detectedUser: User | null,
			detectedUserImageURL: string | null
		) => {
			if (user) return;
			if (!detectedUser && !detectedUserImageURL && !intervalId) {
				// Predict faces heartbeat
				const id = setInterval(async () => {
					try {
						const imageCapture = new ImageCapture(streams[0].getVideoTracks()[0]);
						const photoBlob = await imageCapture.takePhoto().then((blob) => {
							return blob;
						});

						const parsedResult = await predictFaces([photoBlob]);

						const {labels, scores} = parsedResult;

						if (!labels.length) return;

						// Old model may throw error reading deleted user labels
						const predictedUser = await getUser(labels[0]);
						if (predictedUser && scores[0] > face_conf_threshold) {
							appDispatch({type: 'SET_DETECTED_USER', payload: predictedUser});
							const currPhotoURL = URL.createObjectURL(photoBlob);
							appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: currPhotoURL});
						}
					} catch {
						console.log('Error in face prediction');
					}
				}, 2000);
				setIntervalId(id);

				// Set clear face predict interval for cleanup on navigation
				appDispatch({
					type: 'SET_REMOVE_FACE_PREDICT',
					payload: () => {
						clearInterval(id);
						setIntervalId(null);
					}
				});
			} else if (detectedUser && intervalId) {
				clearInterval(intervalId);
				setIntervalId(null);
			}
		};

		if (!mediaStreams?.length) return;

		handlePredictFace(mediaStreams, detectedUser, detectedUserImageURL);
	}, [mediaStreams, detectedUser, detectedUserImageURL, intervalId, user]);

	return (
		<>
			<Helmet>
				<title>Main menu</title>
			</Helmet>
			<Box flex={0.6} p={6}>
				{detectedUser ? (
					<Center w={'100%'} h={'100%'}>
						<Image src={detectedUserImageURL as string} alt={'Detected user'} />
					</Center>
				) : (
					<Camera videoId='mainMenuCamera' mode={'face'} />
				)}
			</Box>
			<Flex flexDirection={'column'} flex={0.4} p={6}>
				{user ? <UserMenu /> : <FaceLogin />}
				<PublicMenu />
			</Flex>
		</>
	);
}
