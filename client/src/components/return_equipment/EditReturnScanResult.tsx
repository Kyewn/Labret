import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {ImageProofCaptureModal} from '@/components/return_equipment/ImageProofCaptureModal';
import {ImageProofViewerModal} from '@/components/return_equipment/ImageProofViewerModal';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {EditImageProofValues, Item} from '@/utils/data';
import {Button, Flex, Spacer, Text, VStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export const EditReturnScanResult: React.FC = () => {
	const navigate = useNavigate();
	const {appDispatch} = useAppContext();
	const scanContext = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {
		goToNext,
		selectedItemState,
		scanResultState,
		imageProofsState,
		imageProofCaptureDisclosure,
		imageProofDisclosure,
		targetRecordState
	} = scanContext;
	const {onOpen: onImageProofCaptureOpen} = imageProofCaptureDisclosure;
	const {onOpen: onImageProofOpen} = imageProofDisclosure;
	const [, setSelectedItem] = selectedItemState;
	const [targetRecord] = targetRecordState;
	const [newScanResult, setScanResult] = scanResultState;
	const [imageProofs] = imageProofsState;
	const oldImageProofs: EditImageProofValues[] =
		newScanResult.map((item) => ({
			itemId: (item.item as Item).itemId,
			imageProof: item.proofOfReturn as Blob
		})) || [];
	const rentedItemList = targetRecord?.rentingItems || [];

	const renderItemResult = () => {
		return rentedItemList.map((rentingItem) => {
			const oldImageProofObj = oldImageProofs.find(
				(proof) => proof.itemId === (rentingItem.item as Item).itemId
			);
			const newImageProofObj = imageProofs.find(
				(proof) => proof.itemId === (rentingItem.item as Item).itemId
			);
			const {imageProof: oldImageProofBlob} = oldImageProofObj || {};
			const {imageProof: newImageProofBlob} = newImageProofObj || {};
			const oldImageProof = oldImageProofBlob ? URL.createObjectURL(oldImageProofBlob) : undefined;
			const newImageProof = newImageProofBlob ? URL.createObjectURL(newImageProofBlob) : undefined;

			return (
				<ScannedItem
					key={(rentingItem.item as Item).itemId}
					itemInfo={rentingItem}
					proofOfReturn={newImageProof || oldImageProof}
					onOpenProofCapture={() => {
						setSelectedItem(rentingItem);
						onImageProofCaptureOpen();
					}}
					onOpenImageBlob={() => {
						setSelectedItem(rentingItem);
						onImageProofOpen();
					}}
				/>
			);
		});
	};

	useEffect(() => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				navigate(-1);
			}
		});
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	}, []);

	return (
		<>
			<ImageProofCaptureModal />
			<ImageProofViewerModal />

			<Flex w={'100%'} paddingY={5} alignItems={'center'}>
				<Text fontWeight={700}>Scan results</Text>
				<Spacer />
			</Flex>

			<VStack overflowY={'auto'} flex={1} w={'100%'}>
				{renderItemResult()}
			</VStack>

			<Flex w={'100%'} justifyContent={'flex-end'} paddingY={5}>
				<Button
					onClick={() => {
						// Update scan result with image proof
						setScanResult(() => {
							const newScanResult = rentedItemList.map((rentingItem) => {
								// Scan result proof
								const oldImageProofObj = oldImageProofs.find(
									(proof) => proof.itemId === (rentingItem.item as Item).itemId
								);
								// Manual proof
								const newImageProofObj = imageProofs.find(
									(proof) => proof.itemId === (rentingItem.item as Item).itemId
								);
								const {imageProof: oldImageProof} = oldImageProofObj || {};
								const {imageProof: newImageProof} = newImageProofObj || {};

								return {
									...rentingItem,
									proofOfReturn: newImageProof || oldImageProof
								};
							});
							return newScanResult;
						});
						goToNext();
					}}
				>
					Next
				</Button>
			</Flex>
		</>
	);
};
