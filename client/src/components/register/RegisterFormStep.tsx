import {useAppContext} from '@/utils/context/AppContext';
import {useRegisterContext} from '@/utils/context/RegisterContext';
import {Button, ButtonGroup, Flex, HStack, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';

const RegisterFormStep: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {goToPrevious} = useRegisterContext();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	return (
		<Flex flex={0.9} paddingX={10}>
			<VStack flex={1} w={'100%'}>
				<HStack flex={1}>
					<ButtonGroup>
						<Button onClick={goToPrevious}>Back</Button>
						<Button>Register</Button>
					</ButtonGroup>
				</HStack>
			</VStack>
			{/*  */}
		</Flex>
	);
};

export default RegisterFormStep;
