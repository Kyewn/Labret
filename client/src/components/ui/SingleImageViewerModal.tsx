import {Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure} from '@chakra-ui/react';

type Props = {
	disclosure: ReturnType<typeof useDisclosure>;
	imageUrl?: string;
};

export const SingleImageViewerModal: React.FC<Props> = ({disclosure, imageUrl}) => {
	const {isOpen, onClose} = disclosure;

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<img src={imageUrl} alt='viewing-image' width={'100%'} height={'100%'} />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
