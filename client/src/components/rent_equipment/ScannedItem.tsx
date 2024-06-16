import {RentedItem} from '@/utils/data';
import {Button, Flex, HStack, IconButton, Tag, TagLabel, Text, Tooltip} from '@chakra-ui/react';
import {Check, Pen, Trash} from 'lucide-react';
import React from 'react';

type Props = {
	itemInfo: RentedItem;
	onOpenEditItem: () => void;
	onDeleteItem: () => void;
	// Return page props
	imageBlob?: Blob;
	onOpenProofCapture?: () => void;
	onOpenImageBlob?: () => void;
};

export const ScannedItem: React.FC<Props> = ({
	itemInfo,
	onOpenEditItem,
	onDeleteItem,
	imageBlob,
	onOpenProofCapture,
	onOpenImageBlob
}) => {
	const {item, rentQuantity} = itemInfo;
	const {itemId, itemName} = item;

	return (
		<Flex key={itemId}>
			<HStack>
				<Tag
					size={'xl'}
					variant='outline'
					borderColor='lrBrown.700'
					borderWidth={2}
					p={5}
					borderRadius={50}
				>
					<TagLabel color='lrBrown.700' fontWeight={700}>
						{rentQuantity}
					</TagLabel>
				</Tag>
				<Text fontWeight={700}>{itemName}</Text>
			</HStack>
			<HStack spacing={1}>
				{imageBlob ? (
					<Tooltip label={'Show image proof'}>
						<IconButton
							isRound
							icon={<Check />}
							color={'green'}
							_hover={{color: 'green', backgroundColor: 'grey.100'}}
							variant={'iconButton'}
							aria-label={'show-image-proof'}
							onClick={onOpenImageBlob}
						/>
					</Tooltip>
				) : (
					<Button variant={'outline'} onClick={onOpenProofCapture}>
						Attach image proof
					</Button>
				)}
				<Tooltip label={'Edit'}>
					<IconButton
						isRound
						icon={<Pen />}
						variant={'iconButton'}
						aria-label={'edit-item'}
						onClick={onOpenEditItem}
					/>
				</Tooltip>

				<Tooltip label={'Delete'}>
					<IconButton
						isRound
						icon={<Trash />}
						variant={'criticalIconButton'}
						aria-label={'delete-item'}
						onClick={onDeleteItem}
					/>
				</Tooltip>
			</HStack>
		</Flex>
	);
};
