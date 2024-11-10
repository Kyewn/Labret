import {FaceLogin} from '@/components/main_menu/FaceLogin';
import {PasswordLogin} from '@/components/main_menu/PasswordLogin';
import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {UserMenu} from '@/components/main_menu/UserMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {getUser} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {User} from '@/utils/data';
import {predictFaces, ToastType} from '@/utils/utils';
import {Box, Center, Flex, Image, Link} from '@chakra-ui/react';
import {KeyRoundIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useLocation, useNavigate} from 'react-router-dom';

const face_conf_threshold = 0.7;

type LocationState = {
	toastType: ToastType;
};

export function MainMenu() {
	const {appState, appDispatch, appUtils} = useAppContext();
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const [isReadingFace, setIsReadingFace] = useState(false);
	const [usePasswordLogin, setUsePasswordLogin] = useState(false);
	const {user, detectedUser, detectedUserImageURL, mediaStreams} = appState;

	const navigate = useNavigate();
	const location = useLocation();
	const {toastType} = (location.state as LocationState) || {};
	const {toast} = appUtils;

	useEffect(() => {
		if (toastType) {
			// state clears needs to be done manually
			navigate(location.pathname, {});
			if (toastType === ToastType.userCreationSuccess) {
				toast({
					title: 'User creation successful',
					description: 'User is pending for review.',
					duration: 5000,
					isClosable: true,
					status: 'success'
				});
			} else if (toastType === ToastType.recordCreationSuccess) {
				toast({
					title: 'Record creation successful',
					description: 'Record is pending for review.',
					duration: 5000,
					isClosable: true,
					status: 'success'
				});
			} else if (toastType === ToastType.returnRecordSuccess) {
				toast({
					title: 'Record return successful',
					description: 'Return is pending for review.',
					duration: 5000,
					isClosable: true,
					status: 'success'
				});
			}
		}
	}, [toast, toastType]);

	useEffect(() => {
		const handlePredictFace = async (
			streams: MediaStream[],
			detectedUser: User | null,
			detectedUserImageURL: string | null
		) => {
			if (!detectedUser && !detectedUserImageURL && !intervalId) {
				// Predict faces heartbeat
				const id = setInterval(async () => {
					try {
						// If user is already logged in || using password login, stop face prediction
						if (user || usePasswordLogin) return;

						const imageCapture = new ImageCapture(streams[0].getVideoTracks()[0]);
						const photoBlob = await imageCapture.takePhoto().then((blob) => {
							return blob;
						});

						setIsReadingFace(true);
						const parsedResult = await predictFaces([photoBlob]);

						const {labels, scores} = parsedResult;

						if (!labels.length || labels[0] == 'labretFaceBG') {
							setIsReadingFace(false);
							return;
						}

						// Old model may throw error reading deleted user labels
						const predictedUser = await getUser(labels[0]);

						// If user is still pending verification, stop face prediction
						if (predictedUser.status === 'pending') {
							setIsReadingFace(false);
							return;
						}

						if (predictedUser && scores[0] > face_conf_threshold) {
							appDispatch({type: 'SET_DETECTED_USER', payload: predictedUser});
							const currPhotoURL = URL.createObjectURL(photoBlob);
							appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: currPhotoURL});
						} else {
							setIsReadingFace(false);
						}
					} catch {
						console.log('Error in face prediction');
					}
				}, 3000);
				setIntervalId(id);

				// Set clear face predict interval for cleanup on navigation
				appDispatch({
					type: 'SET_REMOVE_FACE_PREDICT',
					payload: () => {
						clearInterval(id);
						setIsReadingFace(false);
						setIntervalId(null);
					}
				});
			} else if ((detectedUser && intervalId) || (user && intervalId)) {
				clearInterval(intervalId);
				setIsReadingFace(false);
				setIntervalId(null);
			}
		};

		if (!mediaStreams?.length) return;

		// If user use password login, stop face prediction
		if (usePasswordLogin && intervalId && detectedUser) {
			clearInterval(intervalId);
			setIsReadingFace(false);
			setIntervalId(null);
			return;
		} else if (usePasswordLogin) {
			return;
		}

		handlePredictFace(mediaStreams, detectedUser, detectedUserImageURL);

		return () => {
			setIsReadingFace(false);
		};
	}, [mediaStreams, detectedUser, detectedUserImageURL, intervalId, user, usePasswordLogin]);

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
				{!user && !usePasswordLogin && (
					<Flex justifyContent={'flex-end'}>
						<Box display={'flex'} gap={2} alignItems={'center'}>
							<KeyRoundIcon size={24} color={'darkgray'} />
							<Link
								fontSize={'sm'}
								fontWeight={'bolder'}
								color={'lrBrown.500'}
								onClick={() => setUsePasswordLogin(true)}
							>
								Login with password
							</Link>
						</Box>
					</Flex>
				)}
				{user ? (
					<UserMenu />
				) : usePasswordLogin ? (
					<PasswordLogin setUsePasswordLogin={setUsePasswordLogin} />
				) : (
					<FaceLogin isReadingFace={isReadingFace} />
				)}
				<PublicMenu />
			</Flex>
		</>
	);
}
