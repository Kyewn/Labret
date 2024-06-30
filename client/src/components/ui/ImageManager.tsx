import {useRegisterContext} from '@/utils/context/RegisterContext';
import {useScanContext} from '@/utils/context/ScanContext';
import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Grid,
	GridItem,
	HStack,
	Icon,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import {ArrowLeft, CircleHelp, Ellipsis, Trash} from 'lucide-react';
import {useState} from 'react';

type Props = {
	specifiedImages?: Blob[] | string[];
	isRemovable?: boolean;
	currPreviewIndex?: number;
	handlePreviewClick?: (index: number) => void;
};

const ImageManager: React.FC<Props> = ({
	specifiedImages,
	currPreviewIndex,
	isRemovable,
	handlePreviewClick
}) => {
	const scanContext = useScanContext();
	const registerContext = useRegisterContext();
	const {imagesState, handleRemoveImage} = registerContext || scanContext || {};
	const [contextImages, setImages] = imagesState || [];
	const images = specifiedImages || contextImages || [];
	const [viewingImage, setViewingImage] = useState<Blob | string | null>(null);
	const {isOpen, onOpen, onClose} = useDisclosure(); // Image modal
	const {
		isOpen: isConfirmModalOpen,
		onOpen: onConfirmModalOpen,
		onClose: onConfirmModalClose
	} = useDisclosure(); // Confirmation modal

	const renderPreviewImages = () => {
		if (currPreviewIndex != undefined || currPreviewIndex != null) {
			const currPageNum = Math.trunc(currPreviewIndex / 5);
			const parsedPreviewIndex = currPreviewIndex % 5;

			return images.slice(currPageNum * 5, currPageNum * 5 + 5).map((image, index) => (
				<Box position={'relative'} key={`list-${index}`}>
					<img
						src={
							(image as Blob).arrayBuffer ? URL.createObjectURL(image as Blob) : (image as string)
						}
						alt={`Image ${index}`}
						style={{
							cursor: 'pointer',
							border:
								parsedPreviewIndex == index
									? '3px solid var(--chakra-colors-lrRed-200)'
									: '1px solid var(--chakra-colors-lrBrown-700)',
							objectFit: 'cover',
							width: 100,
							height: 100
						}}
						onClick={() => {
							setViewingImage(image);
							onOpen();
							handlePreviewClick?.(index);
						}}
					/>
					{isRemovable && (
						<IconButton
							variant={'criticalItemIconButton'}
							isRound
							aria-label='Delete item'
							icon={<Trash />}
							onClick={() => handleRemoveImage?.(index)}
						/>
					)}
				</Box>
			));
		}
		return images.slice(0, 5).map((image, index) => (
			<Box position={'relative'} key={`list-${index}`}>
				<img
					src={(image as Blob).arrayBuffer ? URL.createObjectURL(image as Blob) : (image as string)}
					alt={`Image ${index}`}
					style={{
						cursor: 'pointer',
						border: '1px solid var(--chakra-colors-lrBrown-700)',
						objectFit: 'cover',
						width: 100,
						height: 100
					}}
					onClick={() => {
						setViewingImage(image);
						onOpen();
					}}
				/>
				{isRemovable && (
					<IconButton
						variant={'criticalItemIconButton'}
						isRound
						aria-label='Delete item'
						icon={<Trash />}
						onClick={() => handleRemoveImage?.(index)}
					/>
				)}
			</Box>
		));
	};
	const renderAllImages = () => (
		<Grid gridTemplateColumns={'repeat(5, 100px)'} gap={5}>
			{images.map((image, index) => (
				<GridItem position={'relative'} key={`grid-${index}`} w={100} h={100}>
					<img
						src={
							(image as Blob).arrayBuffer ? URL.createObjectURL(image as Blob) : (image as string)
						}
						alt={`Image ${index}`}
						style={{
							cursor: 'pointer',
							border: '1px solid',
							borderColor: 'var(--chakra-colors-lrBrown-700)',
							objectFit: 'cover',
							width: 100,
							height: 100
						}}
						onClick={() => {
							setViewingImage(image);
						}}
					/>
					{isRemovable && (
						<IconButton
							variant={'criticalItemIconButton'}
							isRound
							aria-label='Delete item'
							icon={<Trash />}
							onClick={() => handleRemoveImage?.(index)}
						/>
					)}
				</GridItem>
			))}
		</Grid>
	);

	const renderViewingImage = () => (
		<img
			src={
				(viewingImage as Blob).arrayBuffer
					? URL.createObjectURL(viewingImage as Blob)
					: (viewingImage as string)
			}
			alt={`Image`}
			style={{
				border: '1px solid',
				borderColor: 'var(--chakra-colors-lrBrown-700)',
				objectFit: 'cover',
				width: 640,
				height: 480
			}}
		/>
	);
	const handleRemoveAllImages = () => {
		setImages?.([]);
		onConfirmModalClose();
	};

	return (
		<>
			{/* Confirmation Modal  */}
			<Modal isOpen={isConfirmModalOpen} onClose={onConfirmModalClose}>
				<ModalOverlay />
				<ModalContent paddingY={2} m={'auto'}>
					<ModalCloseButton />
					<ModalHeader>
						<HStack>
							<Icon as={CircleHelp} w={25} h={25} />
							<Text>Confirm your actions</Text>
						</HStack>
					</ModalHeader>
					<ModalBody>Are you sure you want to delete all images stored previously?</ModalBody>
					<ModalFooter>
						<ButtonGroup>
							<Button variant={'outline'} onClick={onConfirmModalClose}>
								Cancel
							</Button>
							<Button onClick={handleRemoveAllImages}>Confirm</Button>
						</ButtonGroup>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{/* Image Modal  */}
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setViewingImage(null);
					onClose();
				}}
			>
				<ModalOverlay />
				<ModalContent paddingY={2} m={1} width={'auto'} maxWidth={'unset'}>
					<ModalCloseButton alignSelf={'flex-end'} position={'relative'} />
					<ModalHeader>
						<HStack>
							{viewingImage && (
								<IconButton
									variant={'iconButton'}
									aria-label='Back'
									icon={<ArrowLeft />}
									onClick={() => setViewingImage(null)}
								/>
							)}
							<Text>All images</Text>
						</HStack>
					</ModalHeader>
					<ModalBody>{viewingImage ? renderViewingImage() : renderAllImages()}</ModalBody>
				</ModalContent>
			</Modal>
			<VStack alignItems={'flex-start'}>
				{images.length ? (
					<HStack marginY={5} spacing={5}>
						{renderPreviewImages()}
						{images.length > 5 && (
							<Tooltip label={'More images'}>
								<IconButton
									variant='iconButton'
									backgroundColor={'lrBrown.400'}
									aria-label='More images'
									icon={<Ellipsis />}
									onClick={onOpen}
								/>
							</Tooltip>
						)}
					</HStack>
				) : (
					<Center flex={1} width={'100%'} mt={5} p={5} border={'2px dashed'} borderRadius={5}>
						<Text fontWeight={700}>No images yet</Text>
					</Center>
				)}
				{isRemovable && images.length > 5 && (
					<Button variant={'criticalOutline'} onClick={onConfirmModalOpen}>
						Remove all images
					</Button>
				)}
			</VStack>
		</>
	);
};

export default ImageManager;
