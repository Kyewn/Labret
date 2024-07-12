import {useAppContext} from '@/utils/context/AppContext';
import {Item, NewRentFormValues, RentalRecord, RentingItem} from '@/utils/data';
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
	const {
		appState: {user}
	} = useAppContext();
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
	const [, setIsDirtyForm] = dirtyFormState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	const handleAddConfirm = (item: RentingItem) => {
		const newItemQuantity = Number.parseInt(item.rentQuantity as string);
		setScanResult((prev) => {
			const existingItem = prev?.find(
				(sr) => (sr.item as Item).itemId === (item.item as Item).itemId
			);
			if (existingItem) {
				return (
					prev?.map((sr) => {
						const currQuantity = Number.parseInt(sr.rentQuantity as string);
						if ((sr.item as Item).itemId === (item.item as Item).itemId) {
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
				if ((sr.item as Item).itemId === (item.item as Item).itemId) {
					return {
						...sr,
						rentQuantity: newRentQuantity
					};
				}
				return sr;
			});

			return newSR || [];
		});
		setIsDirtyForm(true);
	};

	const handleDeleteConfirm = (item: RentingItem) => {
		setScanResult((prev) => {
			return prev?.filter((sr) => (sr.item as Item).itemId !== (item.item as Item).itemId) || [];
		});
		setIsDirtyForm(true);
	};

	const handleAddRent = ({
		recordTitle,
		recordNotes,
		recordReturnDate,
		isReadTnC
	}: NewRentFormValues) => {
		// Only after isReadTnC is true

		// Validate inputs
		// Check item count does not subtract beyond 0

		console.log(recordTitle, recordNotes, recordReturnDate, isReadTnC);
	};

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
		handleDeleteConfirm,
		handleAddRent
	};
};

export const ScanContext = createContext<ReturnType<typeof useInitialScanContext> | undefined>(
	undefined
);

export const useScanContext = () => useContext(ScanContext);
