import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {Item, RentingItem} from '@/utils/data';

import {Heading, Modal, ModalBody, ModalContent, ModalOverlay, VStack} from '@chakra-ui/react';

export const ImageProofViewerModal = () => {
	const {imageProofDisclosure, selectedItemState, imageProofsState} =
		useScanContext() as ReturnType<typeof useInitialScanContext>;
	const [imageProofs] = imageProofsState;
	const {isOpen, onClose} = imageProofDisclosure;
	const [selectedItem] = selectedItemState;
	const oldImageProofUrl = (selectedItem as RentingItem | undefined)?.proofOfReturn;
	const newImageProofObj = imageProofs.find(
		(proof) => proof.itemId === (selectedItem?.item as Item | undefined)?.itemId
	);
	const newImageProofUrl = newImageProofObj?.imageProof;

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<VStack alignItems={'flex-start'}>
						<Heading fontSize={'lg'}>Image Viewer</Heading>
						<img src={newImageProofUrl || oldImageProofUrl} />
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};