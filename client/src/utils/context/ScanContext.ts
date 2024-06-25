import {RentalRecord, RentingItem} from '@/utils/data';
import {useDisclosure, useSteps} from '@chakra-ui/react';
import {createContext, useContext, useState} from 'react';

const steps = [
	{
		title: 'Edit items'
	},
	{
		title: 'Rent Form'
	}
];

export const useInitialScanContext = () => {
	const {activeStep, goToNext, goToPrevious} = useSteps({count: steps.length});
	const imagesState = useState<Blob[]>([]);
	const selectedItemState = useState<RentingItem | null>(null);
	const returningRecordState = useState<RentalRecord | undefined>(undefined);
	const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useDisclosure();
	const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose} = useDisclosure();
	const [images, setImages] = imagesState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	const handleDeleteRentingItem = (index: number) => {};

	const handleEditRentingItem = (index: number) => {};

	return {
		imagesState,
		selectedItemState,
		returningRecordState,
		activeStep,
		steps,
		isEditOpen,
		onEditOpen,
		onEditClose,
		isDeleteOpen,
		onDeleteOpen,
		onDeleteClose,
		goToNext,
		goToPrevious,
		handleRemoveImage,
		handleEditRentingItem,
		handleDeleteRentingItem
	};
};

export const ScanContext = createContext<ReturnType<typeof useInitialScanContext> | undefined>(
	undefined
);

export const useScanContext = () => useContext(ScanContext);
