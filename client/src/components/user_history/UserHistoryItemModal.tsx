import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {SingleImageViewerModal} from '@/components/ui/SingleImageViewerModal';
import {
	useInitialUserHistoryTableContext,
	useUserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
import {Item, mapRecordStatus, RentalRecord} from '@/utils/data';

import {
	Box,
	Button,
	Divider,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spacer,
	Tag,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {Edit} from 'lucide-react';
import {useState} from 'react';

export const UserHistoryItemModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {isOpen, onClose} = disclosure;
	const itemImageDisclosure = useDisclosure();
	const {selectedDataState} = useUserHistoryTableContext() as ReturnType<
		typeof useInitialUserHistoryTableContext
	>;
	const [selectedRecord] = selectedDataState;
	const [selectedItemImage, setSelectedItemImage] = useState<string | undefined>(undefined);

	const handleEdit = () => {};

	const getStatusColor = (status: string) => {
		const lcStatus = status.toLowerCase();

		switch (lcStatus) {
			case 'pending':
				return 'green';

			case 'active':
				return 'green';

			case 'returning':
				return 'yellow';

			case 'rent_reverifying':
			case 'return_reverifying':
				return 'yellow';

			case 'completed':
				return 'green';

			case 'rent_rejected':
			case 'return_rejected':
				return 'red';

			default:
				return 'yellow';
		}
	};

	const renderRentItems = () => {
		const handleOpenImageBlob = (index: number) => {
			if (!selectedRecord) return;
			setSelectedItemImage(
				(selectedRecord as RentalRecord | undefined)?.rentImages[index] as string
			);
		};

		return selectedRecord?.rentingItems?.map((rentingItem, i) => {
			return (
				<ScannedItem
					isEditingImageEnabled={false}
					key={(rentingItem.item as Item).itemId}
					itemInfo={rentingItem}
					onOpenImageBlob={() => handleOpenImageBlob(i)}
				/>
			);
		});
	};

	return (
		<>
			<SingleImageViewerModal disclosure={itemImageDisclosure} imageUrl={selectedItemImage} />

			<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent width={'unset'} minWidth={'75%'} maxWidth={'90%'} height={'90%'}>
					<ModalBody p={5} display={'flex'} flexDirection={'column'}>
						<Flex>
							<HStack spacing={5}>
								<Tag colorScheme={'orange'} fontWeight={'bold'}>
									ID {(selectedRecord as RentalRecord | undefined)?.recordId}
								</Tag>
								{(selectedRecord as RentalRecord | undefined)?.recordStatus && (
									<Tag
										colorScheme={getStatusColor(
											(selectedRecord as RentalRecord | undefined)?.recordStatus as string
										)}
									>
										{mapRecordStatus(
											(selectedRecord as RentalRecord | undefined)?.recordStatus as string
										)}
									</Tag>
								)}
							</HStack>
							<Spacer />

							<Button leftIcon={<Edit />} onClick={handleEdit}>
								Edit
							</Button>
						</Flex>
						<Flex flex={1} mt={5}>
							<VStack flex={1} alignItems={'flex-start'} spacing={5}>
								<HStack width={'100%'} flex={1} spacing={5} alignItems={'flex-start'}>
									<VStack spacing={5} flex={1} alignItems={'flex-start'}>
										<EditableField
											name='recordTitle'
											label={'Title'}
											value={(selectedRecord as RentalRecord | undefined)?.recordTitle}
										/>
										<EditableField
											name='notes'
											label={'Notes'}
											value={(selectedRecord as RentalRecord | undefined)?.notes}
										/>
										<EditableDate
											name='rentedAt'
											label={'Rent Date'}
											value={(selectedRecord as RentalRecord | undefined)?.rentedAt as Date}
										/>
										<EditableDate
											name='expectedReturnAt'
											label={'Expected Return Date'}
											value={(selectedRecord as RentalRecord | undefined)?.expectedReturnAt as Date}
										/>
									</VStack>

									<VStack spacing={5} flex={1} alignItems={'flex-start'}>
										<EditableDate
											name='returnedAt'
											label={'Return Date'}
											value={(selectedRecord as RentalRecord | undefined)?.returnedAt as Date}
										/>
										<EditableField
											name='returnLocation'
											label={'Return Location'}
											value={(selectedRecord as RentalRecord | undefined)?.returnLocation}
										/>
									</VStack>
								</HStack>

								<Box width={'100%'}>
									<ImageManager
										label='Rent Images'
										specifiedImages={(selectedRecord as RentalRecord | undefined)?.rentImages}
									/>
								</Box>

								<Box width={'100%'}>
									<ImageManager
										label='Return Images'
										specifiedImages={(selectedRecord as RentalRecord | undefined)?.rentImages}
									/>
								</Box>
							</VStack>

							<Divider orientation={'vertical'} marginX={5} />

							<VStack flex={0.7} spacing={5} alignItems={'flex-start'}>
								{renderRentItems()}
							</VStack>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
