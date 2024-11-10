import {EditableField} from '@/components/ui/EditableField';
import {getAllAdmins, getAllUsers} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {AddUserFormValues, FormValues, User} from '@/utils/data';
import {decryptPassword} from '@/utils/utils';
import {Button, ButtonGroup, Flex, Text, VStack} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useForm, UseFormRegister} from 'react-hook-form';

type Props = {
	setUsePasswordLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PasswordLogin: React.FC<Props> = ({setUsePasswordLogin}) => {
	const {appState, appDispatch, appUtils} = useAppContext();
	const {detectedUserImageURL, handleCloseExistingPeerConnection} = appState;
	const [users, setUsers] = useState<User[]>([]);
	const {toast} = appUtils;
	const {
		watch,
		register,
		formState: {errors},
		handleSubmit
	} = useForm<AddUserFormValues>();
	const {email, password} = watch();

	const handleLogin = async () => {
		const targetUser = users.find((user) => user.email === email);

		if (!targetUser) {
			toast({
				title: 'Email does not exist',
				description: 'Please enter a valid email address.',
				duration: 5000,
				isClosable: true,
				status: 'error'
			});
			return;
		}

		const encryptedPassword = targetUser.password;
		const parsedPassword = await decryptPassword(encryptedPassword);

		if (password != parsedPassword) {
			toast({
				title: 'Incorrect password',
				description: 'The password you entered was incorrect, please try again.',
				duration: 5000,
				isClosable: true,
				status: 'error'
			});
			return;
		}

		appDispatch({type: 'SET_USER', payload: targetUser});
		appDispatch({type: 'SET_DETECTED_USER', payload: null});
		appDispatch({type: 'SET_DETECTED_USER_IMAGE_URL', payload: null});
		setUsePasswordLogin(false);
		// Close only when there is detected face image, otherwise it will close the camera as it wasnt rerendered
		if (detectedUserImageURL) {
			handleCloseExistingPeerConnection();
		}
	};

	useEffect(() => {
		const fetchAllUserTypes = async () => {
			const allUsers = await getAllUsers();
			const allAdmins = await getAllAdmins();

			setUsers([...allUsers, ...allAdmins]);
		};
		fetchAllUserTypes();
	}, []);

	return (
		<Flex flexDirection={'column'} justifyContent={'center'} flex={0.7}>
			<form id='form' onSubmit={handleSubmit(handleLogin)}>
				<VStack paddingY={5} alignItems={'flex-start'}>
					<Text fontWeight={'700'} color={'lrBrown.700'}>
						Login to your account using your email and password
					</Text>
					<Text color={'lrBrown.700'}>
						Use this only if face login is not working, as your account will not be secure once your
						password is compromised
					</Text>
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
					<EditableField
						valueType='password'
						name={'password'}
						label='Password'
						value={password}
						isEditing={true}
						errorMessage={errors.password?.message}
						rules={{
							required: 'Password is required'
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
								setUsePasswordLogin(false);
							}}
						>
							Cancel
						</Button>
					</ButtonGroup>
				</VStack>
			</form>
		</Flex>
	);
};
