import {RentalRecord} from '@/utils/data';
import {useSteps} from '@chakra-ui/react';
import {createContext, useContext, useState} from 'react';

const steps = [
	{
		title: 'Acquire Image'
	},
	{
		title: 'Registration Form'
	}
];

export const useInitialScanContext = () => {
	const imagesState = useState<Blob[]>([]);
	const returningRecordState = useState<RentalRecord | undefined>(undefined);
	const {activeStep, goToNext, goToPrevious} = useSteps({count: steps.length});
	const [images, setImages] = imagesState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	return {
		imagesState,
		returningRecordState,
		activeStep,
		steps,
		goToNext,
		goToPrevious,
		handleRemoveImage
	};
};

export const ScanContext = createContext<ReturnType<typeof useInitialScanContext> | undefined>(
	undefined
);

export const useScanContext = () => useContext(ScanContext);
