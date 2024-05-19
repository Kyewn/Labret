import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {createUser, userCollection} from '@/db/user';
import {FormValues} from '@/utils/const';
import {useAppContext} from '@/utils/context/AppContext';
import {RegisterFormValues, useRegisterContext} from '@/utils/context/RegisterContext';
import {convertBlobToBase64} from '@/utils/utils';
import {Button, ButtonGroup, Flex, HStack, Spacer, Text, VStack, useToast} from '@chakra-ui/react';
import {getDoc, getDocs} from 'firebase/firestore';
import {useEffect} from 'react';
import {UseFormRegister} from 'react-hook-form';

const RegisterFormStep: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {
		imagesState,
		formState: {errors},
		register,
		handleSubmit,
		goToPrevious
	} = useRegisterContext();
	const [images] = imagesState;
	const toast = useToast();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	const handleCreateUser = async (data: RegisterFormValues) => {
		// Create firebase user
		const userDocs = await getDocs(userCollection);
		const existingUser = userDocs.docs.find((doc) => doc.data().email === data.email);

		if (existingUser) {
			toast({
				title: 'Error',
				description: 'User already exists. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
			throw new Error('User already exists');
		}

		const user = await createUser(data);
		const userData = (await getDoc(user)).data() as RegisterFormValues;

		// Convert images to base64 strings
		const imageStrings = await Promise.all(
			images.map(async (img) => {
				const base64String = await convertBlobToBase64(img);
				return base64String;
			})
		);
		console.log(imageStrings);

		// Send user data to backend for ultralytics pipeline
		await fetch('http://localhost:8000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				id: user.id,
				images: imageStrings,
				...userData
			})
		});

		toast({
			title: 'Success',
			description: 'User creation request has been sent for review.',
			status: 'success',
			duration: 5000,
			isClosable: true
		});

		// TODO redirect to main page
	};

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			await handleCreateUser(data);
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
		} catch {
			toast({
				title: 'Error',
				description: 'Failed to create user. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
		return false;
	};

	return (
		<Flex flex={0.9} paddingX={10} pb={10}>
			<VStack flex={1} w={'100%'}>
				<form id='form' action='#' onSubmit={handleSubmit(onSubmit)} style={{flex: 1}}>
					<VStack>
						<EditableField
							name={'name'}
							label='Name'
							isEditing={true}
							register={register as UseFormRegister<FormValues>}
							errorMessage={errors.name?.message}
							rules={{
								required: 'Name is required',
								pattern: {
									value: /^[a-zA-Z\s]*$/,
									message: 'Invalid name'
								}
							}}
						/>
						<EditableField
							name={'email'}
							label='Email'
							isEditing={true}
							register={register as UseFormRegister<FormValues>}
							errorMessage={errors.email?.message}
							rules={{
								required: 'Email is required',
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: 'Invalid email'
								}
							}}
						/>
						<VStack alignItems={'flex-start'} spacing={0}>
							<Text fontWeight={700} fontSize={'sm'}>
								Face images
							</Text>
							<ImageManager />
						</VStack>
					</VStack>
				</form>

				<HStack width={'100%'}>
					<ButtonGroup width={'100%'}>
						<Button variant={'outline'} onClick={goToPrevious}>
							Back
						</Button>
						<Spacer />
						<Button form='form' type='submit'>
							Register
						</Button>
					</ButtonGroup>
				</HStack>
			</VStack>
			{/*  */}
		</Flex>
	);
};

export default RegisterFormStep;
