import {useSteps} from '@chakra-ui/react';
import {createContext, useContext, useState} from 'react';

const steps = [
	{
		title: 'Acquire Image'
	},
	{
		title: 'Register Form'
	}
];

export const useInitialRegisterContext = () => {
	const imagesState = useState<Blob[]>([]);
	const formDataState = useState<FormData>(new FormData());
	const {activeStep} = useSteps({count: steps.length});

	return {imagesState, formDataState, activeStep, steps};
};

export const RegisterContext = createContext<
	ReturnType<typeof useInitialRegisterContext> | undefined
>(undefined);

export const useRegisterContext = () => useContext(RegisterContext);
