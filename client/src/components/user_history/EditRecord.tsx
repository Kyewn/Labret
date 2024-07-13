import {AddRentingItemModal} from '@/components/rent_equipment/AddRentingItemModal';
import {EditRentingItemModal} from '@/components/rent_equipment/EditRentingItemModal';
import {ImageGallery} from '@/components/rent_equipment/ImageGallery';
import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {
	EditRentalRecordFormValues,
	FormValues,
	Item,
	NewRentFormValues,
	RentalRecord
} from '@/utils/data';
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
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useForm, UseFormRegister, UseFormSetValue} from 'react-hook-form';
import {useLocation, useNavigate} from 'react-router-dom';

export const EditRecord: React.FC = () => {
	const {appDispatch} = useAppContext();
	const navigate = useNavigate();
	const location = useLocation();
	const {selectedRecord} = location.state as {selectedRecord: RentalRecord}; // Get record from location state
	const scanContext = useInitialScanContext() as ReturnType<typeof useInitialScanContext>;
	const {
		selectedItemState,
		specificRecordState,
		scanResultState,
		handleAddConfirm,
		handleEditConfirm,
		handleDeleteConfirm,
		addDisclosure,
		editDisclosure,
		deleteDisclosure,
		dirtyFormState
	} = scanContext;
	const {onOpen: onAddOpen} = addDisclosure;
	const {onOpen: onEditOpen} = editDisclosure;
	const {onOpen: onDeleteOpen} = deleteDisclosure;
	const confirmDialog = useDisclosure();
	const {onOpen: onConfirmBackOpen} = confirmDialog;
	const [selectedItem, setSelectedItem] = selectedItemState;
	const [scanResult, setScanResult] = scanResultState;
	const [specificRecord, setSpecificRecord] = specificRecordState;
	const {
		recordTitle: oldRecordTitle,
		notes: oldNotes,
		rentedAt,
		expectedReturnAt: oldExpectedReturnAt,
		returnLocation: oldReturnLocation,
		rentingItems: oldRentingItems
	} = specificRecord || {};
	const [isDirtyForm, setIsDirtyForm] = dirtyFormState;

	const {
		register,
		watch,
		setValue,
		handleSubmit,
		formState: {errors}
	} = useForm<NewRentFormValues>();
	const {recordTitle, recordNotes, expectedReturnAt, returnLocation} = watch();

	const editRecord = async (data: EditRentalRecordFormValues) => {
		// TODO
		// Validate inputs
		// Check item count does not subtract beyond 0
		console.log(data);
	};

	const handleEdit = async () => {
		// If record is active, send new verification
		// If record is rent_rejected/return_rejected, set record as reverify and send reverify verification
		if (!isDirtyForm) {
			navigate(-1);
			return;
		}

		// Edit and return if only title and notes are changed
		if (recordTitle && recordNotes && !expectedReturnAt && !returnLocation) {
			await editRecord({recordTitle, recordNotes});
			navigate(-1);
			return;
		}

		// Otherwise, edit and send verification
		await editRecord({
			recordTitle,
			recordNotes,
			expectedReturnAt,
			returnLocation,
			...(scanResult && {rentingItems: scanResult})
		});
	};

	const renderItemResult = () =>
		scanResult?.map((rentingItem) => {
			return (
				<ScannedItem
					isEditing={selectedRecord.recordStatus != 'active'}
					isEditingImageEnabled={false}
					key={(rentingItem.item as Item).itemId}
					itemInfo={rentingItem}
					onOpenEditItem={() => {
						setSelectedItem(rentingItem);
						onEditOpen();
					}}
					onDeleteItem={() => {
						setSelectedItem(rentingItem);
						onDeleteOpen();
					}}
				/>
			);
		});

	useEffect(() => {
		// Set selected record in scan context on init
		setScanResult(selectedRecord.rentingItems);
		setSpecificRecord(selectedRecord);
	}, []);

	useEffect(() => {
		// Set form values on specific record change
		setValue('recordTitle', oldRecordTitle);
		setValue('recordNotes', oldNotes);
		setValue('expectedReturnAt', oldExpectedReturnAt as Date);
		setValue('returnLocation', oldReturnLocation);
	}, [specificRecord]);

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
		if (JSON.stringify(scanResult) !== JSON.stringify(oldRentingItems)) {
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

	return (
		<>
			<Helmet>
				<title>Edit Record</title>
			</Helmet>
			<ScanContext.Provider value={scanContext}>
				<Flex flex={1} h={'100%'}>
					<Flex flex={0.5} paddingLeft={5}>
						{/* <ImageGallery specificImageUrls={selectedRecord.rentImages} /> */}
						<ImageGallery
							specificImageUrls={[
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg',
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]}
						/>
					</Flex>
					<Flex flex={0.5} flexDirection={'column'}>
						<Box overflowY={'auto'} paddingRight={5}>
							<Flex w={'100%'} alignItems={'center'}>
								<Heading fontSize={'1.5rem'} paddingY={5}>
									Edit Record
								</Heading>
							</Flex>
							{/* Add */}
							<AddRentingItemModal title={'Add New Item'} handleConfirm={handleAddConfirm} />
							{/* Edit */}
							<EditRentingItemModal title={''} handleConfirm={handleEditConfirm} />
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
								{selectedRecord.recordStatus != 'active' && (
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

									{(specificRecord?.recordStatus == 'returning' ||
										specificRecord?.recordStatus == 'return_reverifying') && (
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
