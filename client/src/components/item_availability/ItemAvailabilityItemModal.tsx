import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getItemAvailabilityRecordInfoColumns} from '@/utils/columns';
import {
	useInitialItemAvailabilityTableContext,
	useItemAvailabilityTableContext
} from '@/utils/context/ItemAvailabilityTableContext';
import {Item, ItemAvailabilityRecordInfoValues, User} from '@/utils/data';

import {
	Flex,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {ColumnSort} from '@tanstack/react-table';
import {useState} from 'react';

export const ItemAvailabilityItemModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {isOpen, onClose} = disclosure;
	const {initRecordsState, selectedDataState} = useItemAvailabilityTableContext() as ReturnType<
		typeof useInitialItemAvailabilityTableContext
	>;
	const relatedRecordSortingState = useState<ColumnSort[]>([{id: 'expectedReturnAt', desc: false}]);
	const [records] = initRecordsState;
	const [selectedItem] = selectedDataState;
	const [, setRelatedRecordSorting] = relatedRecordSortingState;

	const relatedRecords = records?.filter((record) =>
		record.rentingItems.some(
			(rentingItem) => (rentingItem.item as Item).itemId === selectedItem?.itemId
		)
	);
	const data: ItemAvailabilityRecordInfoValues[] =
		relatedRecords?.map((record) => {
			const rentingItem = record.rentingItems.find(
				(rentingItem) => (rentingItem.item as Item).itemId === selectedItem?.itemId
			);
			const rentQuantity = rentingItem?.rentQuantity as number;

			return {
				renterName: (record.renter as User).name,
				expectedReturnAt: record.expectedReturnAt as Date,
				rentQuantity
			};
		}) || [];

	const totalRentedQuantity = data.reduce((acc, curr) => acc + (curr.rentQuantity as number), 0);

	return (
		<>
			<Modal
				scrollBehavior={'inside'}
				isOpen={isOpen}
				onClose={() => {
					setRelatedRecordSorting([{id: 'expectedReturnAt', desc: false}]);
					onClose();
				}}
			>
				<ModalOverlay />
				<ModalContent width={'70%'} minWidth={'75%'} maxWidth={'90%'} height={'90%'}>
					<ModalBody flex={1} p={5}>
						<VStack flex={1} w={'100%'} alignItems={'flex-start'} maxHeight={'100%'}>
							<Flex>
								<Heading fontSize={'lg'}>Related records</Heading>
							</Flex>
							<Flex flex={1} w={'100%'} overflowY={'auto'} paddingY={5}>
								<DataTable
									data={data}
									columns={getItemAvailabilityRecordInfoColumns()}
									sortingState={relatedRecordSortingState}
								/>
							</Flex>
							<Flex w={'100%'} justifyContent={'flex-end'}>
								<Text fontSize={'sm'}>Total rented quantity: {totalRentedQuantity}</Text>
							</Flex>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
