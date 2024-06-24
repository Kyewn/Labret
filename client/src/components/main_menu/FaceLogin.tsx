import {useAppContext} from '@/utils/context/AppContext';
import {
	Button,
	ButtonGroup,
	CircularProgress,
	Flex,
	Heading,
	Skeleton,
	Text,
	VStack
} from '@chakra-ui/react';
import {ScanFace, SearchCheck} from 'lucide-react';

export const FaceLogin: React.FC = () => {
	const {appState, appDispatch} = useAppContext();
	const {detectedUser, videoLoading} = appState;

	if (videoLoading) {
		return (
			<Flex paddingY={7} flexDirection={'column'} flex={0.7}>
				<Skeleton w={'100%'} h={'100%'} rounded={5} />
			</Flex>
		);
	}

	const handleRescan = () => {
		appDispatch({type: 'SET_DETECTED_USER', payload: null});
		appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: null});
	};
	const handleConfirmIdentity = () => {
		appDispatch({type: 'SET_USER', payload: detectedUser});
		appDispatch({type: 'SET_DETECTED_USER', payload: null});
		appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: null});
	};

	return detectedUser ? (
		<Flex flexDirection={'column'} justifyContent={'center'} flex={0.7}>
			<VStack paddingY={5} alignItems={'flex-start'}>
				<Text fontWeight={'700'} color={'lrBrown.700'}>
					Is that you?
				</Text>
				<Heading size={'lg'}>{detectedUser.name}</Heading>
				<ButtonGroup width={'100%'}>
					<Button flex={1} leftIcon={<SearchCheck />} onClick={handleConfirmIdentity}>
						Confirm Identity
					</Button>
					<Button
						flex={1}
						variant={'criticalOutline'}
						leftIcon={<ScanFace />}
						onClick={handleRescan}
					>
						That's Not Me
					</Button>
				</ButtonGroup>
			</VStack>
		</Flex>
	) : (
		<Flex justifyContent={'center'} flexDirection={'column'} flex={0.7}>
			<VStack>
				<CircularProgress isIndeterminate color='lrBrown.700' trackColor='lrBrown.400' />
				<Text fontWeight={'700'} color={'lrBrown.700'}>
					Waiting for recognizable face
				</Text>
			</VStack>
		</Flex>
	);
};
