import {AddUserFormValues} from '@/utils/data';
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

export const useInitialRegisterContext = () => {
	const imagesState = useState<Blob[]>([]);
	const {watch, register, trigger, formState, handleSubmit} = useForm<AddUserFormValues>();
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
		trigger,
		watch,
		handleSubmit
	};
};

export const RegisterContext = createContext<
	ReturnType<typeof useInitialRegisterContext> | undefined
>(undefined);

export const useRegisterContext = () =>
	useContext(RegisterContext) as ReturnType<typeof useInitialRegisterContext>;
