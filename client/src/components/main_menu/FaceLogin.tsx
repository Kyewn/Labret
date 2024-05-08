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
	const {appState} = useAppContext();
	const {detectedUser, videoLoading} = appState;

	if (videoLoading) {
		return (
			<Flex paddingY={7} flexDirection={'column'} flex={0.7}>
				<Skeleton w={'100%'} h={'100%'} rounded={5} />
			</Flex>
		);
	}

	return detectedUser ? (
		<Flex flexDirection={'column'} justifyContent={'center'} flex={0.7}>
			<VStack paddingY={5} alignItems={'flex-start'}>
				<Text fontWeight={'700'} color={'lrBrown.700'}>
					Is that you?
				</Text>
				{/* TODO: Replace with user name*/}
				<Heading size={'lg'}>Brian</Heading>
				<ButtonGroup width={'100%'}>
					<Button flex={1} leftIcon={<SearchCheck />}>
						Confirm Identity
					</Button>
					<Button flex={1} variant={'criticalOutline'} leftIcon={<ScanFace />}>
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
