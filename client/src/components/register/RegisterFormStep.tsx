import { EditableField } from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import { createAdmin, createUser, editUser, userCollection } from '@/db/user';
import { useAppContext } from '@/utils/context/AppContext';
import { useInitialRegisterContext, useRegisterContext } from '@/utils/context/RegisterContext';
import { AddUserFormValues, FormValues } from '@/utils/data';
import { paths } from '@/utils/paths';
import { convertBlobToBase64 } from '@/utils/utils';
import {
	Button,
	ButtonGroup,
	Center,
	Flex,
	HStack,
	Spacer,
	Text,
	VStack,
	useToast
} from '@chakra-ui/react';
import { getDoc, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type ImageInfo = {
	image: {
		id: string;
		urls: {
			original: string;
		};
	};
};

const RegisterFormStep: React.FC<{page: 'register' | 'registerAdmin'}> = ({page}) => {
	const {appState, appDispatch} = useAppContext();
	const {user: appUser} = appState;
	const {
		imagesState,
		formState: {isSubmitting, errors},
		register,
		watch,
		handleSubmit,
		goToPrevious
	} = useRegisterContext() as ReturnType<typeof useInitialRegisterContext>;
	const [images] = imagesState;
	const toast = useToast();
	const navigate = useNavigate();
	const {name, email} = watch();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	const handleCreateUser = async (data: AddUserFormValues) => {
		// Create firebase user
		const userDocs = await getDocs(userCollection);
		const existingUser = userDocs.docs.find((doc) => doc.data().email === data.email);
		if (existingUser) {
			const UserAlreadyExistsError = new Error();
			UserAlreadyExistsError.name = 'UserAlreadyExists';
			throw UserAlreadyExistsError;
		}

		const currentAdmin = (appUser?.id as string) || 'system'; // "system" only used when creating system admin without any other admins
		const user =
			page == 'register' ? await createUser(data) : await createAdmin(data, currentAdmin);
		const userData = (await getDoc(user)).data() as AddUserFormValues;
		// Convert images to base64 strings
		const imageStrings = await Promise.all(
			images.map(async (img) => {
				const base64String = await convertBlobToBase64(img);
				return base64String;
			})
		);
		// Send user data to backend for ultralytics pipeline
		const uploadRes = await fetch('http://localhost:8000/register', {
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

		const resJson = await uploadRes.json();
		const imageUrls = (resJson.uploadedImageInfos as ImageInfo[]).map((info) => {
			const originalUrl = info.image.urls.original;
			return originalUrl.replace('undefined', info.image.id);
		});
		await editUser(user.id, {imageUrls});
	};

	const onSubmit = async (data: AddUserFormValues) => {
		try {
			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: true
			});
			await handleCreateUser(data);
			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: false
			});
			navigate(paths.main.root);
			toast({
				title: 'Success',
				description: 'User creation request has been sent for review.',
				status: 'success',
				duration: 5000,
				isClosable: true
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: false
			});

			switch (err.name) {
				case 'UserAlreadyExists':
					toast({
						title: 'Error',
						description: 'Admin already exists. Please try again.',
						status: 'error',
						duration: 5000,
						isClosable: true
					});
					break;
				default:
					toast({
						title: 'Error',
						description: 'Failed to create admin. Please try again.',
						status: 'error',
						duration: 5000,
						isClosable: true
					});
			}
		}
	};

	return (
		<>
			<Flex flex={0.9} paddingX={10} pb={10}>
				<VStack flex={1} w={'100%'}>
					<form id='form' onSubmit={handleSubmit(onSubmit)} style={{flex: 1}}>
						<VStack>
							<Center>
								<VStack>
									<EditableField
										name={'name'}
										label='Name'
										value={name}
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
										value={email}
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
								</VStack>
							</Center>

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
							<Button form='form' type='submit' isLoading={isSubmitting}>
								Register
							</Button>
						</ButtonGroup>
					</HStack>
				</VStack>
			</Flex>
		</>
	);
};

export default RegisterFormStep;
