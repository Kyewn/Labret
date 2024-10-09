import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {RecordRejected} from '@/components/ui/EmailComponents/RecordRejected';
import {RecordVerified} from '@/components/ui/EmailComponents/RecordVerified';
import ImageManager from '@/components/ui/ImageManager';
import {SingleImageViewerModal} from '@/components/ui/SingleImageViewerModal';
import {
	useInitialVerificationTableContext,
	useVerificationTableContext
} from '@/utils/context/VerificationTableContext';
import {Item, mapRecordStatus, RentalRecord, User, Verification} from '@/utils/data';

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
import {render} from '@react-email/components';
import {useState} from 'react';

export const VerificationItemModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {isOpen, onClose} = disclosure;
	const itemImageProofDisclosure = useDisclosure();
	const {onOpen: onImageProofOpen} = itemImageProofDisclosure;
	const {
		selectedDataState,
		handleVerifyRent,
		handleVerifyReturn,
		handleRejectRent,
		handleRejectReturn
	} = useVerificationTableContext() as ReturnType<typeof useInitialVerificationTableContext>;
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

	const handleSendEmail = async (
		emailType: 'verifyRent' | 'verifyReturn' | 'rejectRent' | 'rejectReturn',
		verification: Verification,
		verifiedBy: string,
		verifiedAt: string
	) => {
		// Send notification email to user
		const recordName = (verification.record as RentalRecord).recordTitle;
		const email = ((verification.record as RentalRecord).renter as User).email;

		if (emailType == 'verifyRent') {
			const emailHtml = await render(
				<RecordVerified
					recordType='rent'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending rent verified',
					email,
					html: emailHtml
				})
			});
		} else if (emailType == 'verifyReturn') {
			const emailHtml = await render(
				<RecordVerified
					recordType='return'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending return verified',
					email,
					html: emailHtml
				})
			});
		} else if (emailType == 'rejectRent') {
			const emailHtml = await render(
				<RecordRejected
					recordType='rent'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending rent rejected',
					email,
					html: emailHtml
				})
			});
		} else if (emailType == 'rejectReturn') {
			const emailHtml = await render(
				<RecordRejected
					recordType='return'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending return rejected',
					email,
					html: emailHtml
				})
			});
		}
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
										onClick={
											(selectedRecord &&
												(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
													'returning') ||
											(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
												'return_reverifying'
												? (e) => {
														if (selectedRecord) {
															const verifiedAt = new Date().toISOString();

															handleRejectReturn(
																e,
																selectedRecord,
																verifiedAt,
																async (
																	verification: Verification,
																	verifiedBy: string,
																	verifiedAt: string
																) => {
																	await handleSendEmail(
																		'rejectReturn',
																		verification,
																		verifiedBy,
																		verifiedAt
																	);
																}
															);
														}
												  }
												: (e) => {
														if (selectedRecord) {
															const verifiedAt = new Date().toISOString();

															handleRejectRent(
																e,
																selectedRecord as Verification,
																verifiedAt,
																async (
																	verification: Verification,
																	verifiedBy: string,
																	verifiedAt: string
																) => {
																	await handleSendEmail(
																		'rejectRent',
																		verification,
																		verifiedBy,
																		verifiedAt
																	);
																}
															);
														}
												  }
										}
									>
										Reject
									</Button>
									<Button
										onClick={
											(selectedRecord &&
												(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
													'returning') ||
											(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
												'return_reverifying'
												? (e) => {
														if (selectedRecord) {
															const verifiedAt = new Date().toISOString();

															handleVerifyReturn(
																e,
																selectedRecord as Verification,
																verifiedAt,
																async (
																	verification: Verification,
																	verifiedBy: string,
																	verifiedAt: string
																) => {
																	await handleSendEmail(
																		'verifyReturn',
																		verification,
																		verifiedBy,
																		verifiedAt
																	);
																}
															);
														}
												  }
												: (e) => {
														if (selectedRecord) {
															const verifiedAt = new Date().toISOString();

															handleVerifyRent(
																e,
																selectedRecord as Verification,
																verifiedAt,
																async (
																	verification: Verification,
																	verifiedBy: string,
																	verifiedAt: string
																) => {
																	await handleSendEmail(
																		'verifyRent',
																		verification,
																		verifiedBy,
																		verifiedAt
																	);
																}
															);
														}
												  }
										}
									>
										Verify
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
									{((selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
										'returning' ||
										(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
											'return_reverifying') && (
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

								{((selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
									'returning' ||
									(selectedRecord?.record as RentalRecord | undefined)?.recordStatus ===
										'return_reverifying') && (
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
