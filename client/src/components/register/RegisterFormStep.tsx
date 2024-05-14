import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {useAppContext} from '@/utils/context/AppContext';
import {useRegisterContext} from '@/utils/context/RegisterContext';
import {Button, ButtonGroup, Flex, HStack, Spacer, Text, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Form} from 'react-hook-form';

const RegisterFormStep: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {control, register, goToPrevious} = useRegisterContext();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	// TODO Save images to flask server (image and model training server)

	return (
		<Flex flex={0.9} paddingX={10} pb={10}>
			<VStack flex={1} w={'100%'}>
				<Form control={control} style={{flex: 1}}>
					<VStack>
						<EditableField label='Name' isEditing={true} name='name' register={register} />
						<EditableField label='Email' isEditing={true} name='email' register={register} />
						<VStack alignItems={'flex-start'} spacing={0}>
							<Text fontWeight={700} size={'sm'}>
								Face images
							</Text>
							<ImageManager />
						</VStack>
					</VStack>
				</Form>

				<HStack width={'100%'}>
					<ButtonGroup width={'100%'}>
						<Button variant={'outline'} onClick={goToPrevious}>
							Back
						</Button>
						<Spacer />
						<Button>Register</Button>
					</ButtonGroup>
				</HStack>
			</VStack>
			{/*  */}
		</Flex>
	);
};

export default RegisterFormStep;
