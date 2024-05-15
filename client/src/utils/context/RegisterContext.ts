import {useSteps} from '@chakra-ui/react';
import {createContext, useContext, useState} from 'react';
import {useForm} from 'react-hook-form';

const steps = [
	{
		title: 'Acquire Image'
	},
	{
		title: 'Registration Form'
	}
];

export type RegisterFormValues = {
	name: string;
	email: string;
};

export type RegisterFormVal2 = {
	type: string;
};

export const useInitialRegisterContext = () => {
	const imagesState = useState<Blob[]>([]);
	const {watch, register, formState, handleSubmit} = useForm<RegisterFormValues>();
	const {activeStep, goToNext, goToPrevious} = useSteps({count: steps.length});
	const [images, setImages] = imagesState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	return {
		formState,
		imagesState,
		activeStep,
		steps,
		goToNext,
		goToPrevious,
		handleRemoveImage,
		register,
		watch,
		handleSubmit
	};
};

export const RegisterContext = createContext<
	ReturnType<typeof useInitialRegisterContext> | undefined
>(undefined);

export const useRegisterContext = () =>
	useContext(RegisterContext) as ReturnType<typeof useInitialRegisterContext>;
