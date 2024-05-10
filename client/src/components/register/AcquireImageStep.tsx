import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {useRegisterContext} from '@/utils/context/RegisterContext';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Heading,
	Icon,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import {Info} from 'lucide-react';
import {useEffect, useRef} from 'react';

const AcquireImageStep: React.FC = () => {
	const {
		appState: {mediaStreams}
	} = useAppContext();
	const {imagesState} = useRegisterContext();
	const [images, setImages] = imagesState;
	const resolution = {
		width: {ideal: 640},
		height: {ideal: 480}
	};
	const fileButtonRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleImageCapture = () => {
		const imageCapture = new ImageCapture(mediaStreams![0].getVideoTracks()[0]);
		imageCapture.takePhoto().then((blob) => {
			setImages([...images, blob]);
		});
	};

	const handleUploadImages = (files: File[]) => {
		//TODO: Implement image upload
		console.log(files);
	};

	useEffect(() => {
		console.log(images);
	}, [images]);

	return (
		<Flex flex={0.9} paddingX={10}>
			<Flex flex={0.5} height={'100%'} flexDirection={'column'}>
				<Flex justifyContent={'flex-end'} w={'100%'} h={'100%'} p={5}>
					<Camera videoId={'registerCamera'} useNormalMode mediaResolution={resolution} />
				</Flex>
			</Flex>
			<Flex flex={0.5} p={5} height={'100%'} flexDirection={'column'}>
				<VStack alignItems={'flex-start'} spacing={5}>
					<Box>
						<HStack alignContent={'center'}>
							<Heading size={'md'}>User image</Heading>
							<Tooltip
								placement='right-start'
								hasArrow
								label={`Please be aware that these images will be used for training the system's facial recognition model, so images should be meaningful for identifying the user. You need to take at least 5 face images to continue to the next section.`}
							>
								<Icon as={Info} />
							</Tooltip>
						</HStack>
						<Text>Look directly into the camera and take pictures using the buttons.</Text>
						<ButtonGroup marginY={5}>
							<Button onClick={handleImageCapture}>Capture image</Button>
							<Button onClick={() => fileButtonRef.current.click()}>Upload images</Button>
							<input
								style={{display: 'none'}}
								ref={fileButtonRef}
								type={'file'}
								multiple
								accept={'image/*'}
								onClick={() => setImages([])}
								onChange={(e) => e.target.files && handleUploadImages(Array.from(e.target.files))}
							/>
						</ButtonGroup>
					</Box>
					<Box>
						<Heading size={'md'}>Images taken</Heading>
					</Box>
				</VStack>
			</Flex>
		</Flex>
	);
};

export default AcquireImageStep;
