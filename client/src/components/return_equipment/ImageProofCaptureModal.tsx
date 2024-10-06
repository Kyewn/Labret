import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {Item} from '@/utils/data';

import {
	Button,
	ButtonGroup,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	VStack
} from '@chakra-ui/react';
import {Check, X} from 'lucide-react';

export const ImageProofCaptureModal = () => {
	const {appState, appDispatch} = useAppContext();
	const {handleCloseNormalCamera, mediaStreams} = appState;
	const {
		imageProofCaptureDisclosure,
		selectedItemState,
		imagesState,
		imageProofsState,
		dirtyFormState
	} = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {isOpen, onClose} = imageProofCaptureDisclosure;
	const [selectedItem] = selectedItemState;
	const [, setIsDirtyForm] = dirtyFormState;
	const [, setImageProofs] = imageProofsState;
	const [, setImages] = imagesState;

	const handleClose = () => {
		handleCloseNormalCamera();
		onClose();
	};

	const handleCapture = async () => {
		if (!mediaStreams) return;
		if (!selectedItem) return;
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		const imageCapture = new ImageCapture(mediaStreams[0].getVideoTracks()[0]);
		const imageProof = await imageCapture.takePhoto().then((blob) => {
			return blob;
		});
		setImages((prev) => [...prev, imageProof]);
		setImageProofs((prev) => {
			const newProof = {
				itemId: (selectedItem.item as Item).itemId,
				imageProof
			};
			const isExistingProof = prev.some(
				(proof) => proof.itemId === (selectedItem.item as Item).itemId
			);
			if (isExistingProof) {
				const otherProofs = prev.filter(
					(proof) => proof.itemId != (selectedItem.item as Item).itemId
				);
				return [...otherProofs, newProof];
			}
			return [...prev, newProof];
		});
		setIsDirtyForm(true);
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
		handleClose();
	};

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<VStack justifyContent={'flex-start'}>
						<Camera videoId='imageProofCapture' useNormalMode />
						<ButtonGroup>
							<Button variant={'secondary'} leftIcon={<X />} onClick={handleClose}>
								Cancel
							</Button>
							<Button leftIcon={<Check />} onClick={handleCapture}>
								Take photo
							</Button>
						</ButtonGroup>
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
