import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Heading,
	Icon,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Text,
	Tooltip,
	useSteps
} from '@chakra-ui/react';
import {Info} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const steps = [
	{
		title: 'Acquire Image'
	},
	{
		title: 'Register Form'
	}
];

export function Register() {
	const {activeStep} = useSteps({count: steps.length});
	const [mediaStreams, setMediaStreams] = useState<MediaStream[]>([]);
	const {appDispatch} = useAppContext();
	const navigate = useNavigate();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				mediaStreams[0]?.getTracks().forEach((track) => track.enabled && track.stop());
				navigate(-1);
			}
		});
	}, []);

	return (
		<>
			<Flex flex={0.1} justifyContent={'center'} p={5}>
				<Stepper index={activeStep} flex={0.3}>
					{steps.map((step, index) => (
						<Step key={index}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon />}
									incomplete={<StepNumber />}
									active={<StepNumber />}
								/>
							</StepIndicator>

							<Box flexShrink='0'>
								<StepTitle>{step.title}</StepTitle>
							</Box>

							<StepSeparator />
						</Step>
					))}
				</Stepper>
			</Flex>
			<Flex flex={0.9} paddingX={10}>
				<Flex flex={0.5} height={'100%'} flexDirection={'column'}>
					<Flex justifyContent={'flex-end'} width={'100%'} p={5}>
						{/* FIXME: Break on changing resolution, needs stopping main menu track / renego */}
						<Camera
							videoId='registerCamera'
							useNormalMode
							mediaStreams={mediaStreams}
							setMediaStreams={setMediaStreams}
						/>
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
		</>
	);
}
