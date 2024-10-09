import {
	Flex,
	Heading,
	ListItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	OrderedList,
	VStack,
	useDisclosure
} from '@chakra-ui/react';

type Props = {
	disclosure: ReturnType<typeof useDisclosure>;
};

export const TermsConditionsModal: React.FC<Props> = ({disclosure}) => {
	const {isOpen, onClose} = disclosure;
	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} maxWidth={'50%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<Heading fontSize={'lg'}>Terms & Conditions</Heading>
					</Flex>
					<Flex flex={1} mt={5}>
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<OrderedList spacing={3}>
								<ListItem>
									A caution fee of RM 20 will be held to prevent frauds and serious cases. It will
									be refunded back to your account after all equipment have been returned with admin
									verification.
								</ListItem>
								<ListItem>
									All records will still be subjected to admin review for verification before the
									refund, and may be terminated without refunds and notified to the user via email
									and the record's detail page.
								</ListItem>
								<ListItem>
									A RM 5 charge will be imposed for any overdue returns and minor mishaps, only RM
									15 will be refunded.
								</ListItem>
								<ListItem>
									The renter is solely responsible for all record information provided and bear all
									consequences if the record is considered as deviant.
								</ListItem>
								<ListItem>
									Refunds may not be returned to renters that are found deceptive and guilty of
									misconduct. Special cases of large losses will be handled separately. Please
									notify lab admins if there are any mistakes done by the system.
								</ListItem>
							</OrderedList>
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
