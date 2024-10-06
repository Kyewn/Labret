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
import {paths} from '@/utils/paths';

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
import {useNavigate} from 'react-router-dom';

export const UserHistoryItemModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const navigate = useNavigate();
	const {isOpen, onClose} = disclosure;
	const itemImageProofDisclosure = useDisclosure();
	const {onOpen: onImageProofOpen} = itemImageProofDisclosure;
	const {selectedDataState} = useUserHistoryTableContext() as ReturnType<
		typeof useInitialUserHistoryTableContext
	>;
	const [selectedRecord] = selectedDataState;
	const [selectedItemImage, setSelectedItemImage] = useState<string | undefined>(undefined);

	const handleEdit = () => {
		navigate(paths.sub.editRecord, {
			state: {
				selectedRecord: selectedRecord
			}
		});
	};

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
		const handleOpenImageBlob = (itemId: string) => {
			if (!selectedRecord) return;
			setSelectedItemImage(
				(selectedRecord as RentalRecord | undefined)?.rentingItems.find(
					(rentingItem) => (rentingItem.item as Item).itemId == itemId
				)?.proofOfReturn as string
			);
			onImageProofOpen();
		};

		return selectedRecord?.rentingItems?.map((rentingItem) => {
			return (
				<ScannedItem
					isEditing={false}
					isEditingImageEnabled={false}
					proofOfReturn={rentingItem.proofOfReturn as string}
					key={(rentingItem.item as Item).itemId}
					itemInfo={rentingItem}
					onOpenImageBlob={() => handleOpenImageBlob((rentingItem.item as Item).itemId)}
				/>
			);
		});
	};

	return (
		<>
			<SingleImageViewerModal disclosure={itemImageProofDisclosure} imageUrl={selectedItemImage} />

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

							{
								// Show edit only if record status is not completed/paid
								(selectedRecord as RentalRecord | undefined)?.recordStatus !== 'completed' &&
									(selectedRecord as RentalRecord | undefined)?.recordStatus !== 'paid' && (
										<Button leftIcon={<Edit />} onClick={handleEdit}>
											{(selectedRecord as RentalRecord | undefined)?.recordStatus ===
												'rent_rejected' ||
											(selectedRecord as RentalRecord | undefined)?.recordStatus ===
												'return_rejected'
												? 'Reverify'
												: 'Edit'}
										</Button>
									)
							}
						</Flex>
						<Flex mt={5}>
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
											value={(selectedRecord as RentalRecord | undefined)?.recordNotes}
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

									{(selectedRecord?.recordStatus === 'returning' ||
										selectedRecord?.recordStatus === 'return_reverifying' ||
										selectedRecord?.recordStatus === 'completed' ||
										selectedRecord?.recordStatus === 'return_rejected' ||
										selectedRecord?.recordStatus === 'paid') && (
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
									)}
								</HStack>

								<Box width={'100%'}>
									<ImageManager
										label='Rent Images'
										specifiedImages={(selectedRecord as RentalRecord | undefined)?.rentImages}
									/>
								</Box>

								{(selectedRecord?.recordStatus === 'returning' ||
									selectedRecord?.recordStatus === 'return_reverifying' ||
									selectedRecord?.recordStatus === 'completed' ||
									selectedRecord?.recordStatus === 'return_rejected' ||
									selectedRecord?.recordStatus === 'paid') && (
									<Box width={'100%'}>
										<ImageManager
											label='Return Images'
											specifiedImages={(selectedRecord as RentalRecord | undefined)?.returnImages}
										/>
									</Box>
								)}
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
