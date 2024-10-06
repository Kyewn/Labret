import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {SingleImageViewerModal} from '@/components/ui/SingleImageViewerModal';
import {useDebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {Item, mapRecordStatus, RentalRecord, Verification} from '@/utils/data';

import {
	Box,
	Button,
	ButtonGroup,
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
import {useState} from 'react';

export const DebtItemModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {isOpen, onClose} = disclosure;
	const itemImageProofDisclosure = useDisclosure();
	const {onOpen: onImageProofOpen} = itemImageProofDisclosure;
	const {
		selectedDataState,
		handleSetAsPaidNormal,
		handleSetAsPaidHeavy,
		handleSetAsNormal,
		handleSetAsHeavy
	} = useDebtTableContext() as ReturnType<typeof useInitialDebtTableContext>;
	const [selectedRecord] = selectedDataState;
	const [selectedItemImage, setSelectedItemImage] = useState<string | undefined>(undefined);

	const getStatusColor = (status: string) => {
		const lcStatus = status.toLowerCase();

		switch (lcStatus) {
			case 'pending':
			case 'returning':
				return 'green';

			case 'rent_reverifying':
			case 'return_reverifying':
				return 'yellow';

			default:
				return 'yellow';
		}
	};

	const renderRentItems = () => {
		const handleOpenImageBlob = (itemId: string) => {
			if (!selectedRecord) return;
			setSelectedItemImage(
				(selectedRecord?.record as RentalRecord | undefined)?.rentingItems.find(
					(rentingItem) => (rentingItem.item as Item).itemId == itemId
				)?.proofOfReturn as string
			);
			onImageProofOpen();
		};

		return (selectedRecord?.record as RentalRecord | undefined)?.rentingItems?.map(
			(rentingItem) => {
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
			}
		);
	};

	return (
		<>
			<SingleImageViewerModal disclosure={itemImageProofDisclosure} imageUrl={selectedItemImage} />

			<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent width={'unset'} minWidth={'75%'} maxWidth={'90%'} height={'90%'}>
					<ModalBody p={5} display={'flex'} flexDirection={'column'}>
						<Flex w={'100%'}>
							<HStack w={'100%'} spacing={5}>
								<Tag colorScheme={'orange'} fontWeight={'bold'}>
									ID {(selectedRecord?.record as RentalRecord | undefined)?.recordId}
								</Tag>
								{(selectedRecord?.record as RentalRecord | undefined)?.recordStatus && (
									<Tag
										colorScheme={getStatusColor(
											(selectedRecord?.record as RentalRecord | undefined)?.recordStatus as string
										)}
									>
										{mapRecordStatus(
											(selectedRecord?.record as RentalRecord | undefined)?.recordStatus as string
										)}
									</Tag>
								)}
								<Spacer />

								<ButtonGroup spacing={3}>
									<Button
										variant='outline'
										onClick={(e) =>
											selectedRecord &&
											(selectedRecord as Verification | undefined)?.isRecordSerious
												? handleSetAsNormal(e, selectedRecord as Verification)
												: handleSetAsHeavy(e, selectedRecord as Verification)
										}
									>
										{selectedRecord && (selectedRecord as Verification | undefined)?.isRecordSerious
											? 'Change to normal'
											: 'Change to Heavy'}
									</Button>
									<Button
										onClick={(e) =>
											selectedRecord &&
											(selectedRecord as Verification | undefined)?.isRecordSerious
												? handleSetAsPaidHeavy(e, selectedRecord as Verification)
												: handleSetAsPaidNormal(e, selectedRecord as Verification)
										}
									>
										Set As Paid
									</Button>
								</ButtonGroup>
							</HStack>
						</Flex>
						<Flex mt={5}>
							<VStack flex={1} alignItems={'flex-start'} spacing={5}>
								<HStack width={'100%'} flex={1} spacing={5} alignItems={'flex-start'}>
									<VStack spacing={5} flex={1} alignItems={'flex-start'}>
										<EditableField
											name='recordTitle'
											label={'Title'}
											value={(selectedRecord?.record as RentalRecord | undefined)?.recordTitle}
										/>
										<EditableField
											name='notes'
											label={'Notes'}
											value={(selectedRecord?.record as RentalRecord | undefined)?.recordNotes}
										/>
										<EditableDate
											name='rentedAt'
											label={'Rent Date'}
											value={(selectedRecord?.record as RentalRecord | undefined)?.rentedAt as Date}
										/>
										<EditableDate
											name='expectedReturnAt'
											label={'Expected Return Date'}
											value={
												(selectedRecord?.record as RentalRecord | undefined)
													?.expectedReturnAt as Date
											}
										/>
									</VStack>
									{(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
										'return_rejected' && (
										<VStack spacing={5} flex={1} alignItems={'flex-start'}>
											<EditableDate
												name='returnedAt'
												label={'Return Date'}
												value={
													(selectedRecord?.record as RentalRecord | undefined)?.returnedAt as Date
												}
											/>
											<EditableField
												name='returnLocation'
												label={'Return Location'}
												value={(selectedRecord?.record as RentalRecord | undefined)?.returnLocation}
											/>
										</VStack>
									)}
								</HStack>

								<Box width={'100%'}>
									<ImageManager
										label='Rent Images'
										specifiedImages={
											(selectedRecord?.record as RentalRecord | undefined)?.rentImages
										}
									/>
								</Box>

								{(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
									'return_rejected' && (
									<Box width={'100%'}>
										<ImageManager
											label='Return Images'
											specifiedImages={
												(selectedRecord?.record as RentalRecord | undefined)?.returnImages
											}
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
