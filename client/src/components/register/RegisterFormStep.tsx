import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {FormValues} from '@/utils/const';
import {useAppContext} from '@/utils/context/AppContext';
import {RegisterFormValues, useRegisterContext} from '@/utils/context/RegisterContext';
import {Button, ButtonGroup, Flex, HStack, Spacer, Text, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {UseFormRegister} from 'react-hook-form';

const RegisterFormStep: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {
		register,
		handleSubmit,
		watch,
		formState: {isValid},
		goToPrevious
	} = useRegisterContext();
	const {name, email} = watch();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	useEffect(() => {
		console.log(name, email, isValid);
	}, [name, email, isValid]);

	// TODO Save images to flask server (image and model training server)
	const onSubmit = (data: RegisterFormValues) => {
		console.log(data.name, data.email);
	};

	return (
		<Flex flex={0.9} paddingX={10} pb={10}>
			<VStack flex={1} w={'100%'}>
				<form id='form' onSubmit={handleSubmit(onSubmit)} style={{flex: 1}}>
					<VStack>
						<EditableField
							name={'name'}
							label='Name'
							isEditing={true}
							register={register as UseFormRegister<FormValues>}
						/>
						<EditableField
							name={'email'}
							label='Email'
							isEditing={true}
							register={register as UseFormRegister<FormValues>}
						/>
						<VStack alignItems={'flex-start'} spacing={0}>
							<Text fontWeight={700} size={'sm'}>
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
