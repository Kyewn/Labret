import ImageManager from '@/components/ui/ImageManager';
import {Box, Flex, HStack, IconButton, Image, VStack} from '@chakra-ui/react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useEffect, useState} from 'react';

type Props = {
	images?: Blob[];
	specificImageUrls?: string[];
	handlePreviewChange?: (index: number) => void;
};

export const ImageGallery: React.FC<Props> = ({images, handlePreviewChange, specificImageUrls}) => {
	const [imageIndex, setImageIndex] = useState(0);
	const [currPage, setCurrPage] = useState(0);
	const imageUrls = specificImageUrls || images?.map((image) => URL.createObjectURL(image)) || [];

	const handleNextPreview = () => {
		setImageIndex((prev) => {
			const newVal = prev + 1 > imageUrls.length - 1 ? imageUrls.length - 1 : prev + 1;
			handlePreviewChange?.(newVal);
			return newVal;
		});
	};

	const handlePrevPreview = () => {
		setImageIndex((prev) => {
			const newVal = prev - 1 < 0 ? 0 : prev - 1;
			handlePreviewChange?.(newVal);
			return newVal;
		});
	};

	const handlePreviewClick = (index: number) => {
		setImageIndex(currPage * 5 + index);
		handlePreviewChange?.(index);
	};

	useEffect(() => {
		setCurrPage(Math.floor(imageIndex / 5));
	}, [imageIndex]);

	return (
		<VStack flex={1} p={5}>
			<Image flex={1} src={specificImageUrls?.[imageIndex] || imageUrls[imageIndex]} h={'75%'} />
			<HStack>
				<Flex>
					<IconButton
						isDisabled={imageIndex == 0}
						onClick={handlePrevPreview}
						icon={<ChevronLeft />}
						minWidth={'3rem'}
						aria-label='prev-image'
					/>
				</Flex>
				<Box flex={1}>
					<ImageManager
						specifiedImages={specificImageUrls || images}
						currPreviewIndex={imageIndex}
						handlePreviewClick={handlePreviewClick}
					/>
				</Box>
				<Flex>
					<IconButton
						isDisabled={imageIndex == imageUrls.length - 1}
						onClick={handleNextPreview}
						icon={<ChevronRight />}
						minWidth={'3rem'}
						aria-label={'next-image'}
					/>
				</Flex>
			</HStack>
		</VStack>
	);
};
