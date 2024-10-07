import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {Item} from '@/utils/data';

import {Heading, Modal, ModalBody, ModalContent, ModalOverlay, VStack} from '@chakra-ui/react';

export const ImageProofViewerModal = () => {
	const {imageProofDisclosure, selectedItemState, scanResultState, imageProofsState} =
		useScanContext() as ReturnType<typeof useInitialScanContext>;
	const [imageProofs] = imageProofsState;
	const {isOpen, onClose} = imageProofDisclosure;
	const [scanResult] = scanResultState;
	const [selectedItem] = selectedItemState;
	const oldImageProof = scanResult.find(
		(rentingItem) =>
			(rentingItem.item as Item).itemId == (selectedItem?.item as Item | undefined)?.itemId
	)?.proofOfReturn as string | Blob;
	const oldImageProofUrl = (oldImageProof as Blob)?.arrayBuffer
		? URL.createObjectURL(oldImageProof as Blob)
		: (oldImageProof as string);

	const newImageProofObj = imageProofs.find(
		(proof) => proof.itemId === (selectedItem?.item as Item | undefined)?.itemId
	);
	const newImageProofBlob = newImageProofObj?.imageProof;
	const newImageProofUrl = newImageProofBlob ? URL.createObjectURL(newImageProofBlob) : undefined;

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
