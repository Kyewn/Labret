import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {useAppContext} from '@/utils/context/AppContext';
import {mapUserStatus} from '@/utils/data';

import {
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Tag,
	VStack,
	useDisclosure
} from '@chakra-ui/react';

export const UserProfileModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {
		appState: {user}
	} = useAppContext();
	const {isOpen, onClose} = disclosure;

	const getStatusColor = (status: string) => {
		const lcStatus = status.toLowerCase();
		if (lcStatus.includes('active')) {
			return 'green';
		} else {
			return 'yellow';
		}
	};

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<HStack spacing={5}>
							<Tag colorScheme={'orange'} fontWeight={'bold'}>
								ID {user?.id}
							</Tag>
							{user?.status && (
								<Tag colorScheme={getStatusColor(user?.status)}>{mapUserStatus(user?.status)}</Tag>
							)}
						</HStack>
					</Flex>
					<Flex flex={1} mt={5}>
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<EditableField name='name' label={'Name'} value={user?.name} />
							<EditableField name='email' label={'Email'} value={user?.email} />
							<EditableDate
								label={'Creation Date'}
								name='createdAt'
								value={new Date(user?.createdAt as string)}
							/>
							<ImageManager specifiedImages={user?.imageUrls} />
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
