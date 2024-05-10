import RenterImageCollector from '@/components/register/AcquireImageStep';
import {useAppContext} from '@/utils/context/AppContext';
import {RegisterContext, useInitialRegisterContext} from '@/utils/context/RegisterContext';
import {
	Box,
	Flex,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper
} from '@chakra-ui/react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export function Register() {
	const {appState, appDispatch} = useAppContext();
	const initialRegisterContext = useInitialRegisterContext();
	const {activeStep, steps} = initialRegisterContext;
	const {handleCloseNormalCamera} = appState;
	const navigate = useNavigate();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				handleCloseNormalCamera();
				navigate(-1);
			}
		});
	}, [handleCloseNormalCamera]);

	return (
		<RegisterContext.Provider value={initialRegisterContext}>
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
			<RenterImageCollector />
		</RegisterContext.Provider>
	);
}
