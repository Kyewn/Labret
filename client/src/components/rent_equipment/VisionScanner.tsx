import ImageManager from '@/components/ui/ImageManager';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {
	Button,
	ButtonGroup,
	Center,
	CircularProgress,
	Flex,
	HStack,
	Heading,
	IconButton,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import {ArrowLeft} from 'lucide-react';
import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';

type Props = {
	backLabel: string;
	title?: string;
	handleScan?: () => void;
};

export const VisionScanner: React.FC<Props> = ({backLabel, title, handleScan}) => {
	const {appState, appDispatch} = useAppContext();
	const {pageLoading, mediaStreams, handleCloseExistingPeerConnection} = appState;
	const navigate = useNavigate();
	const scanContext = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {imagesState, activeStep, goToPrevious} = scanContext;
	const [images, setImages] = imagesState;
	const hasImages = !!images.length;
	const fileButtonRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleSubHeaderBack = () => {
		if (activeStep == 1) {
			goToPrevious();
			return;
		}
		handleCloseExistingPeerConnection();
		navigate(-1);
	};

	const handleUploadImages = async (files: File[]) => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		const blobs = files.map((file) => new Blob([file], {type: file.type}));

		// FIXME: Remove duplicates that are already in the images array (currently cant find any way)
		setImages((prev) => [...prev, ...blobs]);
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	const handleImageCapture = () => {
		const imageCapture = new ImageCapture(mediaStreams![0].getVideoTracks()[0]);
		imageCapture.takePhoto().then((blob) => {
			setImages([...images, blob]);
		});
	};

	return (
		<>
			<HStack>
				<Tooltip placement='bottom' hasArrow label={'Back'}>
					<IconButton
						aria-label={'Back'}
						variant={'iconButton'}
						isRound
						icon={<ArrowLeft />}
						onClick={handleSubHeaderBack}
					/>
				</Tooltip>
				<Heading fontSize={'md'}>{backLabel}</Heading>
			</HStack>
			{title && <Text fontSize={'sm'}>{title}</Text>}
			<VStack
				flex={1}
				justifyContent={'center'}
				alignItems={'stretch'}
				width={'100%'}
				mt={5}
				spacing={5}
			>
				<CircularProgress
					paddingY={5}
					display={'flex'}
					justifyContent={'center'}
					isIndeterminate
					color='lrBrown.700'
					trackColor='lrBrown.400'
				/>
				<Text fontWeight={'700'} fontSize={'14'} color={'lrBrown.700'} textAlign={'center'}>
					Place your equipment in front of the camera and make sure they are visible. Press the
					button to start scanning. Do not include the same items after you already captured their
					image.
				</Text>

				<Text fontWeight={'700'} fontSize={'14'} color={'lrBrown.700'} textAlign={'center'}>
					Take multiple photos if there are too many equipment to fit into the screen.
				</Text>
				<Center>
					<ButtonGroup>
						<Button onClick={handleImageCapture}>Take photo</Button>
						<Button variant={'outline'} onClick={() => fileButtonRef.current.click()}>
							Upload photos
						</Button>
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
				</Center>

				<ImageManager isRemovable />
			</VStack>
			<Flex justifyContent={'flex-end'}>
				<Button isDisabled={!hasImages} isLoading={pageLoading} onClick={handleScan}>
					Scan
				</Button>
			</Flex>
		</>
	);
};
