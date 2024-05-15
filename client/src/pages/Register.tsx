import AcquireImageStep from '@/components/register/AcquireImageStep';
import RegisterFormStep from '@/components/register/RegisterFormStep';
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
import {Helmet} from 'react-helmet-async';

export function Register() {
	const initialRegisterContext = useInitialRegisterContext();
	const {activeStep, steps} = initialRegisterContext;

	return (
		<>
			<Helmet>
				<title>Register</title>
			</Helmet>
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

				{activeStep === 0 && <AcquireImageStep />}
				{activeStep === 1 && <RegisterFormStep />}
			</RegisterContext.Provider>
		</>
	);
}
