import {
	Flex,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	useDisclosure,
	VStack
} from '@chakra-ui/react';

type Props = {
	disclosure: ReturnType<typeof useDisclosure>;
	imageUrl?: string;
};

export const SingleImageViewerModal: React.FC<Props> = ({disclosure, imageUrl}) => {
	const {isOpen, onClose} = disclosure;

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'100%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'} overflow={'hidden'}>
					<VStack spacing={3} alignItems={'flex-start'}>
						<Heading fontSize={'lg'}>Image Viewer</Heading>
						<Flex flex={1} width={'100%'} height={'100%'} justifyContent={'center'}>
							<img src={imageUrl} alt='viewing-image' width={'90%'} height={'90%'} />
						</Flex>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
