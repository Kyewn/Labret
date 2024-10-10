import {EditableField} from '@/components/ui/EditableField';
import {AdminRegistered} from '@/components/ui/EmailComponents/AdminRegistered';
import ImageManager from '@/components/ui/ImageManager';
import {config} from '@/config';
import {createAdmin, createUser, editUser, getAllAdmins, userCollection} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialRegisterContext, useRegisterContext} from '@/utils/context/RegisterContext';
import {AddUserFormValues, FormValues} from '@/utils/data';
import {paths} from '@/utils/paths';
import {convertBlobToBase64, encryptPassword, formatDateAndTime, ToastType} from '@/utils/utils';
import {
	Button,
	ButtonGroup,
	Center,
	Flex,
	HStack,
	Spacer,
	Text,
	Tooltip,
	VStack
} from '@chakra-ui/react';
import {render} from '@react-email/components';
import {getDoc, getDocs} from 'firebase/firestore';
import {InfoIcon} from 'lucide-react';
import {useEffect} from 'react';
import {UseFormRegister} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

type ImageInfo = {
	image: {
		id: string;
		urls: {
			original: string;
		};
	};
};

const RegisterFormStep: React.FC<{page: 'register' | 'registerAdmin'}> = ({page}) => {
	const {appState, appDispatch, appUtils} = useAppContext();
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
	const navigate = useNavigate();
	const {name, email, password, confirmPassword} = watch();
	const {toast} = appUtils;

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	const handleCreateUser = async (data: AddUserFormValues) => {
		const {name, email, password, confirmPassword} = data;

		if (password !== confirmPassword) {
			toast({
				title: 'Error',
				description: 'Passwords do not match. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
			return;
		}

		// Create firebase user
		const userDocs = await getDocs(userCollection);
		const existingUser = userDocs.docs.find((doc) => doc.data().email === data.email);
		if (existingUser) {
			const UserAlreadyExistsError = new Error();
			UserAlreadyExistsError.name = 'UserAlreadyExists';
			throw UserAlreadyExistsError;
		}
		const currentAdmin = config.isCreateAdminBySystemEnabled
			? (appUser?.id as string) || 'system' // "system" only used when creating system admin without any other admins
			: (appUser?.id as string);
		const encryptedPassword = await encryptPassword(password);

		const user =
			page == 'register'
				? await createUser({
						name,
						email,
						password: encryptedPassword
				  })
				: await createAdmin(
						{
							name,
							email,
							password: encryptedPassword
						},
						currentAdmin
				  );
		const userData = (await getDoc(user)).data() as AddUserFormValues & {createdAt: string};
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

		if (page == 'registerAdmin') {
			// Send notification email to other admins
			const admins = await getAllAdmins();
			const otherAdminEmails = admins
				.filter(
					(admin) => admin.id != appUser?.id && admin.id != user.id && admin.status == 'active'
				)
				.map((admin) => admin.email);
			const emailHtml = await render(
				<AdminRegistered
					newAdminName={data.name}
					authorName={appUser?.name as string}
					createdAt={formatDateAndTime(new Date(userData.createdAt))}
				/>
			);

			for (const email of otherAdminEmails) {
				await fetch('http://localhost:8002/send-email', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					},
					body: JSON.stringify({
						subject: 'New Admin Registration',
						email,
						html: emailHtml
					})
				});
			}
		}

		navigate(paths.main.root, {
			state: {
				toastType: ToastType.userCreationSuccess
			}
		});
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
						description: 'User already exists. Please try again.',
						status: 'error',
						duration: 5000,
						isClosable: true
					});
					break;
				default:
					toast({
						title: 'Error',
						description: 'Failed to create user. Please try again.',
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
								<VStack spacing={5} alignItems={'flex-start'}>
									<HStack spacing={5}>
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
									</HStack>
									<HStack spacing={5} justifyContent={'center'}>
										<EditableField
											valueType='password'
											name={'password'}
											label='Password'
											value={password}
											isEditing={true}
											register={register as UseFormRegister<FormValues>}
											errorMessage={errors.password?.message}
											rules={{
												required: 'Password is required',
												pattern: {
													value:
														/^(?=.*\d)(?=.*[.!@#$%^&.])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
													message: 'Password do not match pattern.'
												}
											}}
										/>
										<EditableField
											valueType='password'
											name={'confirmPassword'}
											label='Confirm Password'
											value={confirmPassword}
											isEditing={true}
											register={register as UseFormRegister<FormValues>}
											errorMessage={errors.confirmPassword?.message}
											rules={{
												required: 'Confirm password is required',
												validate: (value) => value === password || 'Passwords do not match'
											}}
										/>
										<Tooltip
											label='
											Passwords should contain at least 8 alphanumeric characters, one numeric and special character.
											'
											aria-label='Passwords must match'
											placement='bottom'
											hasArrow
										>
											<InfoIcon width={100} />
										</Tooltip>
									</HStack>
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
