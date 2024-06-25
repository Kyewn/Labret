import {ImageGallery} from '@/components/rent_equipment/ImageGallery';
import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {RentingItem} from '@/utils/data';
import {Button, Flex, Heading, Spacer, Text, VStack} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';
import {useLocation} from 'react-router-dom';

type LocationState = {
	images: Blob[];
};

export function RentResult() {
	const {appState} = useAppContext();
	const location = useLocation();
	const scanContext = useInitialScanContext() as ReturnType<typeof useInitialScanContext>;
	const {
		activeStep,
		goToNext,
		goToPrevious,
		selectedItemState,
		isEditOpen,
		isDeleteOpen,
		onEditOpen,
		onDeleteOpen
	} = scanContext;
	const {user} = appState;
	const [selectedItem, setSelectedItem] = selectedItemState;
	const {images} = location.state as LocationState;

	const dummyItems: RentingItem[] = [
		{
			item: {
				itemId: 'ABC123',
				itemName: 'Beaker',
				itemImages: '',
				itemQuantity: 123
			},
			rentQuantity: 2
		},
		{
			item: {
				itemId: 'AC123',
				itemName: 'Balls',
				itemImages: '',
				itemQuantity: 1223
			},
			rentQuantity: 5
		},
		{
			item: {
				itemId: 'A1333',
				itemName: 'Cups',
				itemImages: '',
				itemQuantity: 12
			},
			rentQuantity: 3
		}
	];

	const renderItemResult = () =>
		// FIXME: Change to actual items after development
		dummyItems.map((rentingItem) => {
			return (
				<ScannedItem
					itemInfo={rentingItem}
					onOpenEditItem={() => {
						setSelectedItem(rentingItem);
						onEditOpen();
					}}
					onDeleteItem={onDeleteOpen}
				/>
			);
		});

	return (
		<>
			<Helmet>
				<title>Rent</title>
			</Helmet>
			<ScanContext.Provider value={scanContext}>
				<Flex flex={1} h={'100%'}>
					<Flex flex={0.5}>
						<ImageGallery images={images} />
					</Flex>
					<Flex flex={0.5} flexDirection={'column'} paddingX={5}>
						<Flex w={'100%'} alignItems={'center'}>
							<Heading fontSize={'1.5rem'} paddingY={5}>
								Scan result
							</Heading>
							<Spacer />
							<Text>{user?.name || 'Brian'}</Text>
						</Flex>

						<Flex w={'100%'} paddingY={3}>
							<Text>Item Listing</Text>
						</Flex>

						<VStack overflowY={'auto'} flex={1} w={'100%'}>
							{renderItemResult()}
						</VStack>

						<Flex w={'100%'} justifyContent={'flex-end'} paddingY={5}>
							<Button> Next</Button>
						</Flex>
					</Flex>
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
