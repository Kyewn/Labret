import {AddRentingItemModal} from '@/components/rent_equipment/AddRentingItemModal';
import {EditRentingItemModal} from '@/components/rent_equipment/EditRentingItemModal';
import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {Item} from '@/utils/data';
import {Button, Center, Flex, Heading, Spacer, Text, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const EditRentScanResult: React.FC = () => {
	const navigate = useNavigate();
	const {appDispatch} = useAppContext();
	const scanContext = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {
		goToNext,
		selectedItemState,
		scanResultState,
		addDisclosure,
		editDisclosure,
		deleteDisclosure,
		handleAddConfirm,
		handleEditConfirm,
		handleDeleteConfirm
	} = scanContext;
	const {onOpen: onAddOpen} = addDisclosure;
	const {onOpen: onEditOpen} = editDisclosure;
	const {onOpen: onDeleteOpen} = deleteDisclosure;
	const [selectedItem, setSelectedItem] = selectedItemState;
	const [newScanResult] = scanResultState;

	const renderItemResult = () =>
		newScanResult.map((rentingItem) => {
			return (
				<ScannedItem
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
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				navigate(-1);
			}
		});
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	}, []);

	return (
		<>
			{/* Add */}
			<AddRentingItemModal title={'Add New Item'} handleConfirm={handleAddConfirm} />
			{/* Edit */}
			<EditRentingItemModal title={'Edit Item'} handleConfirm={handleEditConfirm} />
			{/* Delete */}
			<ConfirmDialog
				disclosure={deleteDisclosure}
				title={'Delete Item'}
				description={'Are you sure?'}
				onConfirm={() => selectedItem && handleDeleteConfirm(selectedItem)}
			/>

			<Flex w={'100%'} paddingY={5} alignItems={'center'}>
				<Text fontWeight={700}>Scan results</Text>
				<Spacer />
				<Button onClick={onAddOpen}>Add Item</Button>
			</Flex>

			<VStack overflowY={'auto'} flex={1} w={'100%'}>
				{newScanResult.length ? (
					renderItemResult()
				) : (
					<Center>
						<Heading fontSize={'md'}>No items were detected</Heading>
					</Center>
				)}
			</VStack>

			<Flex w={'100%'} justifyContent={'flex-end'} paddingY={5}>
				<Button onClick={goToNext}>Next</Button>
			</Flex>
		</>
	);
};
