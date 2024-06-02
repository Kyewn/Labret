import ImageManager from '@/components/ui/ImageManager';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {
	Button,
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
import {useNavigate} from 'react-router-dom';

type Props = {
	backLabel: string;
	title?: string;
	handleScan?: () => void;
};

export const VisionScanner: React.FC<Props> = ({backLabel, title, handleScan}) => {
	const {appState} = useAppContext();
	const {pageLoading, mediaStreams, handleCloseExistingPeerConnection} = appState;
	const navigate = useNavigate();
	const scanContext = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {imagesState, activeStep, goToPrevious} = scanContext;

	const handleSubHeaderBack = () => {
		if (activeStep == 1) {
			goToPrevious();
			return;
		}
		handleCloseExistingPeerConnection();
		navigate(-1);
	};

	const [images, setImages] = imagesState;
	const hasImages = !!images.length;

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
					display={'flex'}
					justifyContent={'center'}
					isIndeterminate
					color='lrBrown.700'
					trackColor='lrBrown.400'
				/>
				<Text fontWeight={'700'} color={'lrBrown.700'} textAlign={'center'}>
					Place your equipment in front of the camera and press the button to start scanning.
				</Text>
				<Text fontWeight={'700'} color={'lrBrown.700'} textAlign={'center'}>
					Take multiple photos if there are too many equipment to fit into the screen.
				</Text>
				<Center>
					<Button variant={'outline'} onClick={handleImageCapture}>
						Take photo
					</Button>
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
