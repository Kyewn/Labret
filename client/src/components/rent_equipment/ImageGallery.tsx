import ImageManager from '@/components/ui/ImageManager';
import {Box, Flex, HStack, IconButton, Image, VStack} from '@chakra-ui/react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useState} from 'react';

type Props = {
	images: Blob[];
};

export const ImageGallery: React.FC<Props> = ({images}) => {
	const [imageIndex, setImageIndex] = useState(0);
	const imageUrls = images.map((image) => URL.createObjectURL(image));

	const handleNextPreview = () => {
		setImageIndex((prev) => {
			return prev + 1;
		});
	};

	const handlePrevPreview = () => {
		setImageIndex((prev) => {
			return prev - 1;
		});
	};

	return (
		<VStack flex={1} p={5}>
			<Image flex={1} src={imageUrls[imageIndex]} h={'75%'} />
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
					<ImageManager specifiedImages={images} currPreviewIndex={imageIndex} />
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
