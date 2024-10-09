import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {SingleImageViewerModal} from '@/components/ui/SingleImageViewerModal';
import {getAllVerifications} from '@/db/verification';
import {
	useInitialUserHistoryTableContext,
	useUserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
import {Item, mapRecordStatus, RentalRecord, User, Verification} from '@/utils/data';
import {paths} from '@/utils/paths';
import {formatDate} from '@/utils/utils';

import {
	AbsoluteCenter,
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
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {BadgeCheck, Edit, InfoIcon, OctagonAlert} from 'lucide-react';
import {useEffect, useState} from 'react';
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
	const [relatedVerification, setRelatedVerification] = useState<Verification | undefined>(
		undefined
	);

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
				return 'yellow';

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

	const getVerification = async () => {
		const verifications = await getAllVerifications();
		const verification = verifications.find(
			(verification) =>
				(verification.record as RentalRecord).recordId ===
				(selectedRecord as RentalRecord | undefined)?.recordId
		);
		setRelatedVerification(verification);
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

	// Get related verification
	useEffect(() => {
		getVerification();
	}, [selectedRecord]);

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
										{relatedVerification?.verifiedAt ? (
											relatedVerification?.isRecordSerious ? (
												<HStack spacing={5} flex={1} alignItems={'flex-start'}>
													<OctagonAlert color='red' />
													<Text fontWeight={'700'} color={'lrRed.300'}>
														This record was marked as a serious case.
													</Text>
												</HStack>
											) : selectedRecord?.recordStatus != 'rent_rejected' &&
											  selectedRecord?.recordStatus != 'return_rejected' ? (
												<HStack spacing={5} flex={1} alignItems={'flex-start'}>
													<BadgeCheck color='green' />
													<Text fontWeight={'700'} color={'green'}>
														This record had been verified.
													</Text>
												</HStack>
											) : undefined
										) : (
											<HStack spacing={5} flex={1} alignItems={'flex-start'}>
												<InfoIcon color='#3252a8' />
												<Text fontWeight={'700'} color={'#3252a8'}>
													This record is pending for verification.
												</Text>
											</HStack>
										)}
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
								{relatedVerification &&
									(selectedRecord?.recordStatus == 'rent_rejected' ||
										selectedRecord?.recordStatus == 'return_rejected') && (
										<Box width={'100%'}>
											<Box py={5} width={'100%'} position={'relative'}>
												<Divider orientation={'horizontal'} />
												<AbsoluteCenter bg={'white'} px={10} fontWeight={'bold'}>
													Verification details
												</AbsoluteCenter>
											</Box>

											<VStack spacing={5} alignItems={'flex-start'}>
												<EditableField
													name='verifiedBy'
													label={'Verified by'}
													value={
														(
															(relatedVerification as Verification | undefined)?.verifiedBy as
																| User
																| undefined
														)?.name
													}
												/>
												<EditableField
													name='verifiedAt'
													label={'Verified at'}
													value={formatDate(
														(relatedVerification as Verification | undefined)?.verifiedAt as Date
													)}
												/>
												<EditableField
													name='verificationComments'
													label={'Verification comments'}
													value={
														(relatedVerification as Verification | undefined)?.verificationComments
													}
												/>
											</VStack>
										</Box>
									)}
							</VStack>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
