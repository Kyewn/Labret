import {Camera} from '@/components/ui/Camera/Camera';
import ImageManager from '@/components/ui/ImageManager';
import {useAddItemContext, useInitialAddItemContext} from '@/utils/context/AddItemContext';
import {useAppContext} from '@/utils/context/AppContext';
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
import {useNavigate} from 'react-router-dom';

const AcquireImageStep: React.FC = () => {
	const {appState, appDispatch} = useAppContext();
	const {imagesState, goToNext} = useAddItemContext() as ReturnType<
		typeof useInitialAddItemContext
	>;
	const [images, setImages] = imagesState;
	const resolution = {
		width: {ideal: 640},
		height: {ideal: 480}
	};
	const {mediaStreams, handleCloseNormalCamera} = appState;
	const navigate = useNavigate();
	const fileButtonRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleImageCapture = () => {
		console.log('ads');
		const imageCapture = new ImageCapture(mediaStreams![0].getVideoTracks()[0]);
		imageCapture.takePhoto().then((blob) => {
			setImages([...images, blob]);
		});
	};

	const handleUploadImages = async (files: File[]) => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		const blobs = files.map((file) => new Blob([file], {type: file.type}));

		// FIXME: Remove duplicates that are already in the images array (currently cant find any way)
		setImages((prev) => [...prev, ...blobs]);
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	useEffect(() => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				handleCloseNormalCamera();
				navigate(-1);
			}
		});
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	}, [handleCloseNormalCamera]);

	return (
		<Flex flex={0.9} paddingX={10}>
			<Flex flex={0.5} height={'100%'} flexDirection={'column'}>
				<Flex justifyContent={'flex-end'} w={'100%'} h={'100%'} p={5}>
					<Camera
						videoId={'registerCamera'}
						useNormalMode
						mediaResolution={resolution}
						// centerBox={{width: '310px', height: '300px'}}
					/>
				</Flex>
			</Flex>
			<Flex flex={0.5} p={5} height={'100%'} flexDirection={'column'}>
				<VStack flex={1} alignItems={'flex-start'} spacing={5}>
					<Box>
						<HStack alignContent={'center'}>
							<Heading size={'md'}>Item image</Heading>
							<Tooltip
								placement='right-start'
								hasArrow
								label={`Please be aware that these images will be used for training the system's item detection model, so images should be meaningful for identifying the item. You need to take at least 5 item images to continue to the next section, more images makes the model more accurate in detecting the time.`}
							>
								<Icon as={Info} />
							</Tooltip>
						</HStack>
						<Text>
							Take pictures of the item naturally as they might appear when scanning using the
							device. Take as many additional images and you can allow the model to learn better by
							including different perspectives and view angles.
						</Text>
						<ButtonGroup marginY={5}>
							<Button onClick={handleImageCapture}>Capture image</Button>
							<Tooltip label={'Prefer 640 x 640 resolution'}>
								<Button variant={'outline'} onClick={() => fileButtonRef.current.click()}>
									Upload images
								</Button>
							</Tooltip>
							<input
								style={{display: 'none'}}
								ref={fileButtonRef}
								type={'file'}
								multiple
								accept={'image/*'}
								onChange={(e) => {
									const files = e.target.files && Array.from(e.target.files);
									files && handleUploadImages(files);
								}}
							/>
						</ButtonGroup>
					</Box>
					<VStack flex={1} width={'100%'}>
						<ImageManager isRemovable label='Images taken' />
					</VStack>
					<Flex w={'100%'} justifyContent={'flex-end'}>
						<Button
							isDisabled={images.length < 5}
							onClick={() => {
								handleCloseNormalCamera();
								goToNext();
							}}
						>
							Next
						</Button>
					</Flex>
				</VStack>
			</Flex>
		</Flex>
	);
};

export default AcquireImageStep;
