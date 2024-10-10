import {EditableField} from '@/components/ui/EditableField';
import {useAppContext} from '@/utils/context/AppContext';
import {AddUserFormValues, FormValues} from '@/utils/data';
import {
	Button,
	ButtonGroup,
	CircularProgress,
	Flex,
	Heading,
	Skeleton,
	Text,
	useSteps,
	VStack
} from '@chakra-ui/react';
import {ScanFace, SearchCheck} from 'lucide-react';
import {useForm, UseFormRegister} from 'react-hook-form';

type Props = {
	isReadingFace: boolean;
};

export const FaceLogin: React.FC<Props> = ({isReadingFace}) => {
	const {appState, appDispatch, appUtils} = useAppContext();
	const {toast} = appUtils;
	const {detectedUser, videoLoading, handleCloseExistingPeerConnection} = appState;
	const {activeStep, goToNext, goToPrevious} = useSteps({count: 2});
	const {
		watch,
		register,
		formState: {errors},
		handleSubmit
	} = useForm<AddUserFormValues>();
	const {email} = watch();

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
		handleCloseExistingPeerConnection();
	};

	const handleConfirmIdentity = () => {
		appDispatch({type: 'SET_USER', payload: detectedUser});
		appDispatch({type: 'SET_DETECTED_USER', payload: null});
		appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: null});
		handleCloseExistingPeerConnection();
	};

	const handleVerifyEmail = () => {
		if (detectedUser?.email != email) {
			toast({
				title: 'Email does not match',
				description: 'Please enter the correct email address.',
				duration: 5000,
				isClosable: true,
				status: 'error'
			});
			return;
		}

		handleConfirmIdentity();
		goToPrevious();
	};

	// If detected user
	return detectedUser ? (
		activeStep == 0 ? (
			// If first step, show confirmation
			<Flex flexDirection={'column'} justifyContent={'center'} flex={0.7}>
				<VStack paddingY={5} alignItems={'flex-start'}>
					<Text fontWeight={'700'} color={'lrBrown.700'}>
						Is that you?
					</Text>
					<Heading size={'lg'}>{detectedUser.name}</Heading>
					<ButtonGroup width={'100%'}>
						<Button flex={1} leftIcon={<SearchCheck />} onClick={goToNext}>
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
			// If second step, show email challege
			<Flex flexDirection={'column'} justifyContent={'center'} flex={0.7}>
				<form id='form' onSubmit={handleSubmit(handleVerifyEmail)}>
					<VStack paddingY={5} alignItems={'flex-start'}>
						<Text fontWeight={'700'} color={'lrBrown.700'}>
							Please verify the email for
						</Text>
						<Heading size={'lg'}>{detectedUser.name}</Heading>
						<EditableField
							name={'email'}
							label='Email'
							value={email}
							isEditing={true}
							errorMessage={errors.email?.message}
							rules={{
								required: 'Email is required'
							}}
							register={register as UseFormRegister<FormValues>}
						/>
						<ButtonGroup width={'100%'} marginTop={3}>
							<Button flex={1} form='form' type='submit'>
								Login
							</Button>
							<Button
								flex={1}
								variant={'outline'}
								onClick={() => {
									handleRescan();
									goToPrevious();
								}}
							>
								Cancel
							</Button>
						</ButtonGroup>
					</VStack>
				</form>
			</Flex>
		)
	) : // If no detected user
	isReadingFace ? (
		// If reading face, show face reading
		<Flex justifyContent={'center'} flexDirection={'column'} flex={0.7}>
			<VStack>
				<CircularProgress isIndeterminate color='lrBrown.700' trackColor='lrBrown.400' />
				<Text fontWeight={'700'} color={'lrBrown.700'}>
					Reading face...
				</Text>
			</VStack>
		</Flex>
	) : (
		// If not reading face, show loading
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
