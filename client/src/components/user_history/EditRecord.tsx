import {AddRentingItemModal} from '@/components/rent_equipment/AddRentingItemModal';
import {EditRentingItemModal} from '@/components/rent_equipment/EditRentingItemModal';
import {ImageGallery} from '@/components/rent_equipment/ImageGallery';
import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {ImageProofCaptureModal} from '@/components/return_equipment/ImageProofCaptureModal';
import {ImageProofViewerModal} from '@/components/return_equipment/ImageProofViewerModal';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {getAllItems} from '@/db/item';
import {editRecord, getAllRecords, getRecord} from '@/db/record';
import {editVerification, getAllVerifications} from '@/db/verification';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {
	EditRentalRecordFormValues,
	FormValues,
	Item,
	RentalRecord,
	RentingItem,
	Verification
} from '@/utils/data';
import {paths} from '@/utils/paths';
import {ToastType} from '@/utils/utils';
import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Flex,
	Heading,
	Spacer,
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {addMonths} from 'date-fns';
import {deleteField} from 'firebase/firestore';
import {IKCore} from 'imagekitio-react';
import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useForm, UseFormRegister, UseFormSetValue} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

export const EditRecord: React.FC = () => {
	const {appDispatch, appUtils} = useAppContext();
	const {toast} = appUtils;
	const navigate = useNavigate();
	const location = useLocation();
	const {selectedRecord} = location.state as {selectedRecord: RentalRecord}; // Get record from location state
	const scanContext = useInitialScanContext() as ReturnType<typeof useInitialScanContext>;
	const {
		selectedItemState,
		targetRecordState,
		scanResultState,
		imagesState,
		imageProofsState,
		imageProofCaptureDisclosure,
		imageProofDisclosure,
		handleAddConfirm,
		handleEditConfirm,
		handleDeleteConfirm,
		addDisclosure,
		editDisclosure,
		deleteDisclosure,
		dirtyFormState
	} = scanContext;
	const [images, setImages] = imagesState;
	const [imageProofs] = imageProofsState;
	const {onOpen: onAddOpen} = addDisclosure;
	const {onOpen: onEditOpen} = editDisclosure;
	const {onOpen: onDeleteOpen} = deleteDisclosure;
	const {onOpen: onImageProofCaptureOpen} = imageProofCaptureDisclosure;
	const {onOpen: onImageProofOpen} = imageProofDisclosure;
	const confirmDialog = useDisclosure();
	const {onOpen: onConfirmBackOpen} = confirmDialog;
	const [selectedItem, setSelectedItem] = selectedItemState;
	const [scanResult, setScanResult] = scanResultState;
	const [targetRecord, setTargetRecord] = targetRecordState;
	const {
		recordTitle: oldRecordTitle,
		recordNotes: oldNotes,
		rentedAt,
		expectedReturnAt: oldExpectedReturnAt,
		returnLocation: oldReturnLocation,
		rentingItems: oldRentingItems
	} = targetRecord || {};
	const [isDirtyForm, setIsDirtyForm] = dirtyFormState;
	const [allRecords, setAllRecords] = useState<RentalRecord[]>([]);
	const [completeItemList, setCompleteItemList] = useState<Item[]>([]);
	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm<EditRentalRecordFormValues>();
	const {recordTitle, recordNotes, expectedReturnAt, returnLocation} = watch();

	const fetchRecords = async () => {
		const records = await getAllRecords();
		setAllRecords(records);
	};

	const getCompleteItemList = async (recordId: string) => {
		// Just to get remaining quantities of items
		const items = await getAllItems();
		const record = await getRecord(recordId);
		const itemIds = record.rentingItems.map((rentingItem) => (rentingItem.item as Item).itemId);

		const recordItems = items.filter((item) => {
			return itemIds.includes(item.itemId);
		});

		setCompleteItemList(recordItems);
	};

	const handleEdit = async () => {
		// If record is rent_rejected/return_rejected, set record as reverify and send reverify verification
		if (!isDirtyForm) {
			navigate(-1);
			return;
		}

		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		try {
			if (selectedRecord.recordStatus == 'return_rejected') {
				// when editing return_rejected records
				// Set to reverify if return_rejected
				const imagekit = new IKCore({
					publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
					urlEndpoint: 'https://ik.imagekit.io/oowu/'
				});

				// scanResult is set as old record data
				// If new image proofs from editing returning records
				// Update rentingItem proofOfReturn with new image proofs if any
				const updatedRentingItems = await Promise.all(
					scanResult.map(async (rentingItem) => {
						// new image proof for target item
						const imageProof = imageProofs.find(
							(proof) => proof.itemId == (rentingItem.item as Item).itemId
						)?.imageProof;

						// If no new image proof, return old record data
						if (!imageProof) {
							return {
								...rentingItem,
								...(rentingItem.proofOfReturn
									? {proofOfReturn: rentingItem.proofOfReturn}
									: undefined)
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

						// else return new proof
						return {
							...rentingItem,
							proofOfReturn: uploadResult.url
						};
					})
				);

				const newImageUrls = updatedRentingItems
					.filter((rentingItem) => rentingItem.proofOfReturn as string)
					.map((rentingItem) => rentingItem.proofOfReturn as string);

				// If record is return_rejected, set record as reverify and send reverify verification
				await editRecord(selectedRecord.recordId, {
					recordTitle,
					recordStatus: 'return_reverifying',
					expectedReturnAt: (expectedReturnAt as Date)?.toISOString(),
					returnImages: newImageUrls,
					...(recordNotes && {recordNotes}),
					...(returnLocation && {returnLocation}),
					...(updatedRentingItems && {
						rentingItems: updatedRentingItems.map((sr) => ({
							item: (sr.item as Item).itemId,
							rentQuantity: sr.rentQuantity,
							...(sr.proofOfReturn ? {proofOfReturn: sr.proofOfReturn} : undefined)
						}))
					})
				});

				const verifications = await getAllVerifications();
				const verification = verifications.find(
					(verf) => (verf.record as RentalRecord).recordId == selectedRecord.recordId
				) as Verification;
				await editVerification(verification?.verificationId, {
					updatedAt: deleteField(),
					verifiedBy: deleteField(),
					isRecordSerious: deleteField(),
					verificationComments: deleteField()
				});
			} else {
				// imageProof length unavailable when editing
				// pending / active / rent_rejected / rent_reverifying / returning / return_verifying records
				// Set to reverify only if rent_rejected and send reverify verification
				await editRecord(selectedRecord.recordId, {
					recordTitle,
					expectedReturnAt: (expectedReturnAt as Date)?.toISOString(),
					...(recordNotes && {recordNotes}),
					...(returnLocation && {returnLocation}),
					...(scanResult && {
						rentingItems: scanResult.map((sr) => ({
							item: (sr.item as Item).itemId,
							rentQuantity: sr.rentQuantity,
							...(sr.proofOfReturn ? {proofOfReturn: sr.proofOfReturn} : undefined)
						}))
					}),
					...(selectedRecord.recordStatus == 'rent_rejected'
						? {recordStatus: 'rent_reverifying'}
						: undefined)
				});

				if (selectedRecord.recordStatus == 'rent_rejected') {
					const verifications = await getAllVerifications();
					const verification = verifications.find(
						(verf) => (verf.record as RentalRecord).recordId == selectedRecord.recordId
					) as Verification;
					await editVerification(verification?.verificationId, {
						updatedAt: deleteField(),
						verifiedBy: deleteField(),
						isRecordSerious: deleteField(),
						verificationComments: deleteField()
					});
				}
			}
			navigate(paths.sub.userHistory, {
				state: {
					toastType:
						selectedRecord.recordStatus == 'pending' ||
						selectedRecord.recordStatus == 'active' ||
						selectedRecord.recordStatus == 'rent_rejected' ||
						selectedRecord.recordStatus == 'rent_reverifying'
							? ToastType.editRentSuccess
							: selectedRecord.recordStatus == 'return_rejected'
							? ToastType.reverifyReturnSuccess
							: ToastType.editReturnSuccess // returning / return_reverifying
				}
			});
		} catch (error) {
			console.log(error);
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

	const renderItemResult = () =>
		scanResult?.map((rentingItem) => {
			const newImageProofObj = imageProofs.find(
				(proof) => proof.itemId === (rentingItem.item as Item).itemId
			);
			const {imageProof: newImageProofBlob} = newImageProofObj || {};
			const newImageProof = newImageProofBlob ? URL.createObjectURL(newImageProofBlob) : undefined;
			return (
				<ScannedItem
					isEditing={
						selectedRecord.recordStatus == 'pending' ||
						selectedRecord.recordStatus == 'rent_rejected' ||
						selectedRecord.recordStatus == 'return_rejected' ||
						selectedRecord.recordStatus == 'rent_reverifying'
					}
					isEditingImageEnabled={selectedRecord.recordStatus == 'return_rejected'}
					key={(rentingItem.item as Item).itemId}
					itemInfo={rentingItem}
					proofOfReturn={newImageProof || (rentingItem.proofOfReturn as string | undefined)}
					onOpenEditItem={
						selectedRecord.recordStatus == 'return_rejected'
							? undefined
							: () => {
									setSelectedItem(rentingItem);
									onEditOpen();
							  }
					}
					onDeleteItem={
						selectedRecord.recordStatus == 'return_rejected'
							? undefined
							: () => {
									setSelectedItem(rentingItem);
									onDeleteOpen();
							  }
					}
					onOpenProofCapture={() => {
						setSelectedItem(rentingItem);
						onImageProofCaptureOpen();
					}}
					onOpenImageBlob={() => {
						setSelectedItem(rentingItem);
						onImageProofOpen();
					}}
				/>
			);
		});

	useEffect(() => {
		// Set selected record in scan context on init
		if (selectedRecord) {
			fetchRecords();
			getCompleteItemList(selectedRecord.recordId);
			setScanResult(selectedRecord.rentingItems);
			setImages(
				selectedRecord.recordStatus == 'return_rejected' ||
					selectedRecord.recordStatus == 'return_reverifying'
					? (selectedRecord.returnImages as string[])
					: (selectedRecord.rentImages as string[])
			);
		}
	}, [selectedRecord]);

	useEffect(() => {
		const updatedRentingItems: RentingItem[] = selectedRecord.rentingItems.map((rentingItem) => {
			const updatedItem = completeItemList.find(
				(item) => item.itemId == (rentingItem.item as Item).itemId
			) as Item;
			return {
				...rentingItem,
				item: updatedItem
			};
		});
		const updatedRecord: RentalRecord = {...selectedRecord, rentingItems: updatedRentingItems};

		if (completeItemList.length) {
			setTargetRecord(updatedRecord);
		}
	}, [completeItemList]);

	useEffect(() => {
		// Set form values on specific record change
		setValue('recordTitle', oldRecordTitle);
		setValue('recordNotes', oldNotes);
		setValue('expectedReturnAt', oldExpectedReturnAt as Date);
		setValue('returnLocation', oldReturnLocation);
	}, [targetRecord]);

	// Set dirty form on form change
	useEffect(() => {
		if (
			recordTitle !== oldRecordTitle ||
			recordNotes !== oldNotes ||
			returnLocation !== oldReturnLocation ||
			expectedReturnAt?.toISOString() !== (oldExpectedReturnAt as Date | undefined)?.toISOString()
		) {
			setIsDirtyForm(true);
		} else {
			setIsDirtyForm(false);
		}
	}, [recordTitle, recordNotes, expectedReturnAt, returnLocation]);

	// Set dirty form on item change
	useEffect(() => {
		if (JSON.stringify(scanResult) !== JSON.stringify(oldRentingItems) || imageProofs.length) {
			setIsDirtyForm(true);
		} else {
			setIsDirtyForm(false);
		}
	}, [scanResult]);

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				onConfirmBackOpen();
			}
		});
	}, []);

	// Manual handling of max number for add and edit item modals
	const getRemainingQuantityAtRecordCreationTime = (item: Item) => {
		return (
			(item.itemQuantity as number) -
			allRecords
				.filter(
					(record) =>
						(record.rentedAt as Date) < (selectedRecord.rentedAt as Date) &&
						record.recordStatus != 'paid' &&
						record.recordStatus != 'completed'
				)
				.reduce((acc, record) => {
					return (
						acc +
							(record.rentingItems.find(
								(rentingItem) => (rentingItem.item as Item).itemId == item.itemId
							)?.rentQuantity as number) || 0
					);
				}, 0)
		);
	};

	return (
		<>
			<Helmet>
				<title>Edit Record</title>
			</Helmet>
			<ScanContext.Provider value={scanContext}>
				<Flex flex={1} h={'100%'}>
					<Flex flex={0.5} paddingLeft={5}>
						<ImageGallery specificImageUrls={images as string[]} />
					</Flex>
					<Flex flex={0.5} flexDirection={'column'}>
						<Box overflowY={'auto'} paddingRight={5}>
							<Flex w={'100%'} alignItems={'center'}>
								<Heading fontSize={'1.5rem'} paddingY={5}>
									Edit Record
								</Heading>
							</Flex>
							{/* Add */}
							<AddRentingItemModal
								title={'Add New Item'}
								getRemainingQuantityAtRecordCreationTime={getRemainingQuantityAtRecordCreationTime}
								handleConfirm={handleAddConfirm}
							/>
							{/* Edit */}
							<EditRentingItemModal
								title={'Edit Item'}
								getRemainingQuantityAtRecordCreationTime={getRemainingQuantityAtRecordCreationTime}
								handleConfirm={handleEditConfirm}
							/>
							{/* Add proof */}
							<ImageProofCaptureModal captureBlobAsString />
							{/* View proof */}
							<ImageProofViewerModal />
							{/* Delete */}
							<ConfirmDialog
								disclosure={deleteDisclosure}
								title={'Delete Item'}
								description={'Are you sure?'}
								onConfirm={() => selectedItem && handleDeleteConfirm(selectedItem)}
							/>
							<ConfirmDialog
								disclosure={confirmDialog}
								title={'Discard changes'}
								description={'Are you sure?'}
								onConfirm={() => navigate(-1)}
							/>

							<Flex w={'100%'} paddingY={5} alignItems={'center'}>
								<Text fontWeight={700}>Rented item list</Text>
								<Spacer />
								{(selectedRecord.recordStatus == 'pending' ||
									selectedRecord.recordStatus == 'rent_rejected') && (
									<Button onClick={onAddOpen}>Add Item</Button>
								)}
							</Flex>

							<VStack overflowY={'auto'} w={'100%'}>
								{scanResult?.length ? (
									renderItemResult()
								) : (
									<Center>
										<Heading fontSize={'md'}>No items were detected</Heading>
									</Center>
								)}
							</VStack>

							<form id='form' onSubmit={handleSubmit(handleEdit)}>
								<VStack height={'100%'} paddingY={5} spacing={3} alignItems={'flex-start'}>
									<EditableField
										register={register as UseFormRegister<FormValues>}
										label={'Record title'}
										name={'recordTitle'}
										value={recordTitle}
										rules={{required: 'Record title is required.'}}
										errorMessage={errors.recordTitle?.message}
										isEditing
									/>
									<EditableField
										register={register as UseFormRegister<FormValues>}
										label={'Notes'}
										name={'recordNotes'}
										value={recordNotes}
										isEditing
									/>

									<EditableDate
										label={'Expected Return Date'}
										name={'expectedReturnAt'}
										minDate={oldExpectedReturnAt as Date}
										maxDate={(rentedAt as Date) && addMonths(rentedAt as Date, 6)}
										value={expectedReturnAt || (oldExpectedReturnAt as Date)}
										setValue={setValue as UseFormSetValue<FormValues>}
										isEditing
									/>

									{(targetRecord?.recordStatus == 'returning' ||
										targetRecord?.recordStatus == 'return_reverifying') && (
										<EditableField
											register={register as UseFormRegister<FormValues>}
											label={'Return location'}
											name={'returnLocation'}
											value={returnLocation}
											isEditing
										/>
									)}
								</VStack>
							</form>
							<ButtonGroup w={'100%'} justifyContent={'flex-end'} paddingY={5}>
								<Button variant={'secondary'} onClick={onConfirmBackOpen}>
									Cancel
								</Button>
								<Button type='submit' form='form'>
									Edit
								</Button>
							</ButtonGroup>
						</Box>
					</Flex>
				</Flex>
			</ScanContext.Provider>
		</>
	);
};
