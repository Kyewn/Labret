import {getItem} from '@/db/item';
import {createRecord, editRecord} from '@/db/record';
import {createVerification, editVerification, getAllVerifications} from '@/db/verification';
import {useAppContext} from '@/utils/context/AppContext';
import {
	EditImageProofValues,
	Item,
	NewRentFormValues,
	RentalRecord,
	RentingItem,
	ReturnFormValues,
	Verification
} from '@/utils/data';
import {paths} from '@/utils/paths';
import {predictItems, ToastType} from '@/utils/utils';
import {useDisclosure, useSteps, useToast} from '@chakra-ui/react';
import {deleteField} from 'firebase/firestore';
import {IKCore} from 'imagekitio-react';
import {createContext, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

const rentSteps = [
	{
		title: 'Edit items'
	},
	{
		title: 'Rent Form'
	}
];

const returnSteps = [
	{
		title: 'Edit items'
	},
	{
		title: 'Return Form'
	}
];

// Shared context for rent/return
export const useInitialScanContext = (type: string = 'rent') => {
	const {
		appState: {user},
		appDispatch
	} = useAppContext();
	const navigate = useNavigate();
	const {activeStep, goToNext, goToPrevious} = useSteps({
		count: type == 'rent' ? rentSteps.length : returnSteps.length
	});
	// const scanResultState = useState<RentingItem[] | null>(null);
	const scanResultState = useState<RentingItem[]>([]);
	const readyToRedirectState = useState(false);
	const imagesState = useState<(string | Blob)[]>([]);
	const imageProofsState = useState<EditImageProofValues[]>([]);
	const selectedItemState = useState<RentingItem | null>(null);
	const dirtyFormState = useState<boolean>(false);
	const targetRecordState = useState<RentalRecord | undefined>(undefined);
	const [, setReadyToRedirect] = readyToRedirectState;
	const [scanResult, setScanResult] = scanResultState;
	const [targetRecord] = targetRecordState;

	const addDisclosure = useDisclosure();
	const editDisclosure = useDisclosure();
	const deleteDisclosure = useDisclosure();
	const imageProofCaptureDisclosure = useDisclosure();
	const imageProofDisclosure = useDisclosure();
	const toast = useToast();

	const [images, setImages] = imagesState;
	const [, setIsDirtyForm] = dirtyFormState;

	const handleAddConfirm = (item: RentingItem, specificRemainingQuantity?: number) => {
		const newItemQuantity = Number.parseInt(item.rentQuantity as string);
		const remainingQuantity =
			specificRemainingQuantity || ((item.item as Item).remainingQuantity as number);

		setScanResult((prev) => {
			const existingItem = prev.find(
				(sr) => (sr.item as Item).itemId === (item.item as Item).itemId
			);
			if (existingItem) {
				return (
					prev?.map((sr) => {
						const currQuantity = Number.parseInt(sr.rentQuantity as string);
						const isInvalidQuantity = currQuantity + newItemQuantity > remainingQuantity;

						if ((sr.item as Item).itemId === (item.item as Item).itemId) {
							return {
								...sr,
								// Cap rent quantity at remaining quantity if adding more quantities exceed remaining quantity
								rentQuantity: isInvalidQuantity ? remainingQuantity : currQuantity + newItemQuantity
							};
						}
						return sr;
					}) || []
				);
			}

			const isInvalidQuantity = newItemQuantity > remainingQuantity;
			const adjustedQuantity = isInvalidQuantity ? remainingQuantity : newItemQuantity;
			if (adjustedQuantity === 0) {
				return prev;
			}
			return [...(prev as RentingItem[]), {...item, rentQuantity: adjustedQuantity}];
		});
		setIsDirtyForm(true);
	};

	const handleAddScannedReturningItems = async (item: RentingItem) => {
		const rentedItems = targetRecord?.rentingItems.map((item) => (item.item as Item).itemId) || [];
		const newItemQuantity = Number.parseInt(item.rentQuantity as string);
		const remainingQuantity = (item.item as Item).remainingQuantity as number;

		const isScannedIteminRentItemList = rentedItems.includes((item.item as Item).itemId);
		if (!isScannedIteminRentItemList) {
			return;
		}

		setScanResult((prev) => {
			const existingItem = prev.find(
				(sr) => (sr.item as Item).itemId === (item.item as Item).itemId
			);
			if (existingItem) {
				return (
					prev?.map((sr) => {
						const currQuantity = Number.parseInt(sr.rentQuantity as string);
						const isInvalidQuantity = currQuantity + newItemQuantity > remainingQuantity;

						if ((sr.item as Item).itemId === (item.item as Item).itemId) {
							return {
								...sr,
								// Cap rent quantity at remaining quantity if adding more quantities exceed remaining quantity
								rentQuantity: isInvalidQuantity ? remainingQuantity : currQuantity + newItemQuantity
							};
						}
						return sr;
					}) || []
				);
			}

			const isInvalidQuantity = newItemQuantity > remainingQuantity;
			const adjustedQuantity = isInvalidQuantity ? remainingQuantity : newItemQuantity;
			if (adjustedQuantity === 0) {
				return prev;
			}
			return [...(prev as RentingItem[]), {...item, rentQuantity: adjustedQuantity}];
		});
		setIsDirtyForm(true);
	};

	const handleEditConfirm = (item: RentingItem) => {
		const newRentQuantity = Number.parseInt(item.rentQuantity as string);
		setScanResult((prev) => {
			const newSR = prev.map((sr) => {
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
			return prev.filter((sr) => (sr.item as Item).itemId !== (item.item as Item).itemId) || [];
		});
		setIsDirtyForm(true);
	};

	const handleScan = async (scanType: string) => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		const itemList = Object.entries((await predictItems(images as Blob[])) || {});
		// Structure: {
		// 		itemId: value;
		// }
		for (const [itemId, info] of itemList) {
			const {count, proof} = info as {count: number; proof: number};
			const item = await getItem(itemId);
			const proofBlob = images[proof];
			const rentingItem = {
				item,
				rentQuantity: count,
				...(scanType === 'return' ? {proofOfReturn: proofBlob} : undefined)
			} as RentingItem;
			scanType === 'rent'
				? handleAddConfirm(rentingItem)
				: handleAddScannedReturningItems(rentingItem);
		}
		setReadyToRedirect(true);
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	const handleAddRent = async ({
		recordTitle,
		recordNotes,
		expectedReturnAt,
		isReadTnC
	}: NewRentFormValues) => {
		// Only after isReadTnC is true
		if (!isReadTnC) {
			toast({
				title: 'Please read and agree to the terms and conditions',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
			return;
		}

		// Validate inputs
		// Check item count does not subtract beyond 0
		// Update: Performed simultaneously with handleAddConfirm

		// Create new record
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		try {
			const imagekit = new IKCore({
				publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
				urlEndpoint: 'https://ik.imagekit.io/oowu/'
			});

			const imageUrls: string[] = [];

			await Promise.all(
				images.map(async (image) => {
					const imagekitAuthParams = await fetch('http://localhost:8000/imagekit-auth', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					});

					if (!imagekitAuthParams.ok) {
						throw new Error('Could not authenticate with ImageKit');
					}

					const auth_params = (await imagekitAuthParams.json()).auth_params;

					const uploadResult = await imagekit.upload({
						file: image,
						fileName: uuidv4(),
						token: auth_params.token,
						signature: auth_params.signature,
						expire: auth_params.expire
					});
					imageUrls.push(uploadResult.url);
				})
			);

			const record = await createRecord(
				{
					recordTitle,
					expectedReturnAt: (expectedReturnAt as Date).toISOString(),
					rentingItems: scanResult.map((sr) => ({
						item: (sr.item as Item).itemId,
						rentQuantity: sr.rentQuantity
					})) as RentingItem[],
					rentImages: imageUrls,
					...(recordNotes ? {recordNotes} : undefined)
				},
				user?.id as string
			);

			await createVerification(record.id);

			// Redirect to main page
			navigate(paths.main.root, {
				state: {
					toastType: ToastType.recordCreationSuccess
				}
			});
		} catch (error) {
			toast({
				title: 'Record could not be created',
				description: 'Please try again.',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
		}
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	const handleReturnRecord = async (
		recordId: string,
		{returnLocation, returnNotes, rentingItemsWithImageProof}: ReturnFormValues
	) => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		try {
			const imagekit = new IKCore({
				publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
				urlEndpoint: 'https://ik.imagekit.io/oowu/'
			});

			const imageUrls: string[] = [];

			// Upload return images
			await Promise.all(
				images.map(async (image) => {
					const imagekitAuthParams = await fetch('http://localhost:8000/imagekit-auth', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					});

					if (!imagekitAuthParams.ok) {
						throw new Error('Could not authenticate with ImageKit');
					}

					const auth_params = (await imagekitAuthParams.json()).auth_params;

					const uploadResult = await imagekit.upload({
						file: image,
						fileName: uuidv4(),
						token: auth_params.token,
						signature: auth_params.signature,
						expire: auth_params.expire
					});
					imageUrls.push(uploadResult.url);
				})
			);

			// Upload proofs and update rentingItems
			const parsedRentingItems = await Promise.all(
				rentingItemsWithImageProof.map(async (rentingItem) => {
					const imageProof = rentingItem.proofOfReturn as Blob;
					if (!imageProof) {
						return {
							...rentingItem
						};
					}

					const imagekitAuthParams = await fetch('http://localhost:8000/imagekit-auth', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*'
						}
					});

					if (!imagekitAuthParams.ok) {
						throw new Error('Could not authenticate with ImageKit');
					}

					const auth_params = (await imagekitAuthParams.json()).auth_params;

					const uploadResult = await imagekit.upload({
						file: imageProof,
						fileName: uuidv4(),
						token: auth_params.token,
						signature: auth_params.signature,
						expire: auth_params.expire
					});
					return {
						...rentingItem,
						proofOfReturn: uploadResult.url
					};
				})
			);

			await editRecord(recordId, {
				returnLocation,
				rentingItems: parsedRentingItems.map((sr) => ({
					item: (sr.item as Item).itemId,
					rentQuantity: sr.rentQuantity,
					...(sr.proofOfReturn ? {proofOfReturn: sr.proofOfReturn} : undefined)
				})),
				returnImages: imageUrls,
				recordStatus: 'returning',
				returnedAt: new Date().toISOString(),
				...(returnNotes ? {recordNotes: returnNotes} : undefined)
			});

			// Remove rented verification status
			const verifications = await getAllVerifications();
			const verification = verifications.find(
				(verf) => (verf.record as RentalRecord).recordId == recordId
			) as Verification;
			await editVerification(verification?.verificationId, {
				verifiedAt: deleteField(),
				verifiedBy: deleteField(),
				isRecordSerious: deleteField(),
				verificationComments: deleteField()
			});

			// Redirect to main page
			navigate(paths.main.root, {
				state: {
					toastType: ToastType.returnRecordSuccess
				}
			});
		} catch (error) {
			toast({
				title: 'Record could not be returned',
				description: 'Please try again.',
				status: 'error',
				duration: 3000,
				isClosable: true
			});
		}
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	return {
		activeStep,
		rentSteps,
		returnSteps,
		goToNext,
		goToPrevious,

		imagesState,
		selectedItemState,
		readyToRedirectState,
		scanResultState,
		targetRecordState,
		imageProofsState,
		dirtyFormState,

		addDisclosure,
		editDisclosure,
		deleteDisclosure,
		imageProofCaptureDisclosure,
		imageProofDisclosure,

		handleScan,
		handleRemoveImage,
		handleAddConfirm,
		handleEditConfirm,
		handleDeleteConfirm,
		handleAddRent,
		handleReturnRecord
	};
};

export const ScanContext = createContext<ReturnType<typeof useInitialScanContext> | undefined>(
	undefined
);

export const useScanContext = () => useContext(ScanContext);
