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
	useDisclosure
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
				<ModalContent width={'unset'} minWidth={'75%'} maxWidth={'90%'} height={'90%'}>
					<ModalBody h={'100%'} p={5} overflow={'hidden'}>
						<Flex h={'100%'} flexDirection={'column'} flex={1}>
							<Flex>
								<Heading fontSize={'lg'}>Related records</Heading>
							</Flex>
							<Flex height={'100%'} paddingY={5}>
								<DataTable
									data={data}
									columns={getItemAvailabilityRecordInfoColumns()}
									sortingState={relatedRecordSortingState}
								/>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
