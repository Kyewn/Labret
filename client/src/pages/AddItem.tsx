import AcquireImageStep from '@/components/add_item/AcquireImageStep';
import AddItemFormStep from '@/components/add_item/AddItemFormStep';
import {AddItemContext, useInitialAddItemContext} from '@/utils/context/AddItemContext';
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

export function AddItem() {
	const initialAddItemContext = useInitialAddItemContext();
	const {activeStep, steps} = initialAddItemContext;

	return (
		<>
			<Helmet>
				<title>Add Item</title>
			</Helmet>
			<AddItemContext.Provider value={initialAddItemContext}>
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
				{activeStep === 1 && <AddItemFormStep />}
			</AddItemContext.Provider>
		</>
	);
}
