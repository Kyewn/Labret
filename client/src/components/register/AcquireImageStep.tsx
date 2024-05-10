import {Camera} from '@/components/ui/Camera/Camera';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Heading,
	Icon,
	Text,
	Tooltip
} from '@chakra-ui/react';
import {Info} from 'lucide-react';

const RenterImageCollector: React.FC = () => {
	const resolution = {
		width: {ideal: 640},
		height: {ideal: 480}
	};

	return (
		<Flex flex={0.9} paddingX={10}>
			<Flex flex={0.5} height={'100%'} flexDirection={'column'}>
				<Flex justifyContent={'flex-end'} w={'100%'} h={'100%'} p={5}>
					<Camera videoId={'registerCamera'} useNormalMode mediaResolution={resolution} />
				</Flex>
			</Flex>
			<Flex flex={0.5} p={5} height={'100%'} flexDirection={'column'}>
				<Box>
					<HStack alignContent={'center'}>
						<Heading size={'md'}>User image</Heading>
						<Tooltip
							placement='right-start'
							hasArrow
							label={`Please be aware that these images will be used for training the system's facial recognition model, so images should be as meaningful for identifying the user. You need to take at least 5 images to continue to the next section.`}
						>
							<Icon as={Info} />
						</Tooltip>
					</HStack>
					<Text>Look directly into the camera and take pictures using the buttons.</Text>
					<ButtonGroup marginY={5}>
						<Button>Take image</Button>
						<Button variant={'outline'}>Upload images</Button>
					</ButtonGroup>
				</Box>
			</Flex>
		</Flex>
	);
};

export default RenterImageCollector;
