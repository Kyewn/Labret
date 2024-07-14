import {ScannedItem} from '@/components/rent_equipment/ScannedItem';
import {ImageProofCaptureModal} from '@/components/return_equipment/ImageProofCaptureModal';
import {ImageProofViewerModal} from '@/components/return_equipment/ImageProofViewerModal';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {EditImageProofValues, Item} from '@/utils/data';
import {Button, Center, Flex, Heading, Spacer, Text, VStack} from '@chakra-ui/react';
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
		imageProofDisclosure
	} = scanContext;
	const {onOpen: onImageProofCaptureOpen} = imageProofCaptureDisclosure;
	const {onOpen: onImageProofOpen} = imageProofDisclosure;
	const [, setSelectedItem] = selectedItemState;
	const [newScanResult] = scanResultState;
	const [imageProofs] = imageProofsState;
	const oldImageProofs: EditImageProofValues[] =
		newScanResult?.map((item) => ({
			itemId: (item.item as Item).itemId,
			imageProof: item.proofOfReturn as string
		})) || [];

	const renderItemResult = () =>
		newScanResult?.map((rentingItem) => {
			const oldImageProofObj = oldImageProofs.find(
				(proof) => proof.itemId === (rentingItem.item as Item).itemId
			);
			const newImageProofObj = imageProofs.find(
				(proof) => proof.itemId === (rentingItem.item as Item).itemId
			);
			const {imageProof: oldImageProof} = oldImageProofObj || {};
			const {imageProof: newImageProof} = newImageProofObj || {};
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
				{newScanResult?.length ? (
					renderItemResult()
				) : (
					<Center>
						<Heading fontSize={'md'}>No items were detected</Heading>
					</Center>
				)}
			</VStack>

			<Flex w={'100%'} justifyContent={'flex-end'} paddingY={5}>
				<Button onClick={goToNext}>Next</Button>
			</Flex>
		</>
	);
};
