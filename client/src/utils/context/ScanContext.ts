import {RentalRecord, RentingItem} from '@/utils/data';
import {useDisclosure, useSteps} from '@chakra-ui/react';
import {createContext, useContext, useEffect, useState} from 'react';

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
	const scanResultState = useState<RentingItem[] | null>(null);
	const imagesState = useState<Blob[]>([]);
	const selectedItemState = useState<RentingItem | null>(null);
	const dirtyFormState = useState<boolean>(false);
	const returningRecordState = useState<RentalRecord | undefined>(undefined);
	const [, setScanResult] = scanResultState;

	const addDisclosure = useDisclosure();
	const editDisclosure = useDisclosure();
	const deleteDisclosure = useDisclosure();
	const imageProofDisclosure = useDisclosure();

	const [images, setImages] = imagesState;
	const [dirtyForm, setIsDirtyForm] = dirtyFormState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	const handleAddConfirm = (item: RentingItem) => {
		const newItemQuantity = Number.parseInt(item.rentQuantity as string);
		setScanResult((prev) => {
			const existingItem = prev?.find((sr) => sr.item.itemId === item.item.itemId);
			if (existingItem) {
				return (
					prev?.map((sr) => {
						const currQuantity = Number.parseInt(sr.rentQuantity as string);
						if (sr.item.itemId === item.item.itemId) {
							return {
								...sr,
								rentQuantity: currQuantity + newItemQuantity
							};
						}
						return sr;
					}) || []
				);
			}
			return [...(prev as RentingItem[]), item];
		});
		setIsDirtyForm(true);
	};

	const handleEditConfirm = (item: RentingItem) => {
		const newRentQuantity = Number.parseInt(item.rentQuantity as string);
		setScanResult((prev) => {
			const newSR = prev?.map((sr) => {
				if (sr.item.itemId === item.item.itemId) {
					return {
						...sr,
						rentQuantity: newRentQuantity
					};
				}
				return sr;
			});
			console.log(newRentQuantity, newSR);

			return newSR || [];
		});
		setIsDirtyForm(true);
	};

	const handleDeleteConfirm = (item: RentingItem) => {
		setScanResult((prev) => {
			return prev?.filter((sr) => sr.item.itemId !== item.item.itemId) || [];
		});
		setIsDirtyForm(true);
	};

	useEffect(() => {
		console.log(dirtyForm);
	});

	return {
		activeStep,
		steps,
		goToNext,
		goToPrevious,

		imagesState,
		selectedItemState,
		scanResultState,
		returningRecordState,
		dirtyFormState,

		addDisclosure,
		editDisclosure,
		deleteDisclosure,
		imageProofDisclosure,

		handleRemoveImage,
		handleAddConfirm,
		handleEditConfirm,
		handleDeleteConfirm
	};
};

export const ScanContext = createContext<ReturnType<typeof useInitialScanContext> | undefined>(
	undefined
);

export const useScanContext = () => useContext(ScanContext);
