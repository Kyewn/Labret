import {Item, RentingItem} from '@/utils/data';
import {
	Button,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Tag,
	TagLabel,
	Text,
	Tooltip
} from '@chakra-ui/react';
import {Check, Pen, Trash} from 'lucide-react';
import React from 'react';

type Props = {
	itemInfo: RentingItem;
	onOpenEditItem?: () => void;
	onDeleteItem?: () => void;
	// Return page props
	proofOfReturn?: string;
	onOpenProofCapture?: () => void;
	onOpenImageBlob?: () => void;
	isEditing?: boolean;
	isEditingImageEnabled?: boolean;
};

export const ScannedItem: React.FC<Props> = ({
	itemInfo,
	onOpenEditItem,
	onDeleteItem,
	proofOfReturn,
	onOpenProofCapture,
	onOpenImageBlob,
	isEditing = true,
	isEditingImageEnabled = true
}) => {
	const {item, rentQuantity} = itemInfo;
	const {itemId, itemName} = item as Item;

	return (
		<Flex w={'100%'} key={itemId}>
			<HStack spacing={5}>
				<Tag
					size={'xl'}
					variant='outline'
					borderColor='lrBrown.700'
					borderWidth={2}
					paddingX={5}
					paddingY={4}
					borderRadius={'50%'}
				>
					<TagLabel color='lrBrown.700' fontWeight={700}>
						{rentQuantity}
					</TagLabel>
				</Tag>
				<Text fontWeight={700} maxWidth={'20rem'} wordBreak={'break-word'}>
					{itemName}
				</Text>
			</HStack>
			<Spacer />
			{isEditing && (
				<HStack spacing={1}>
					{proofOfReturn ? (
						<HStack>
							<Button variant={'outline'} onClick={onOpenProofCapture}>
								Retake
							</Button>
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
						</HStack>
					) : isEditingImageEnabled ? (
						<Button variant={'outline'} onClick={onOpenProofCapture}>
							Attach image proof
						</Button>
					) : undefined}
					{onOpenEditItem && (
						<Tooltip label={'Edit'}>
							<IconButton
								isRound
								icon={<Pen />}
								variant={'iconButton'}
								aria-label={'edit-item'}
								onClick={onOpenEditItem}
							/>
						</Tooltip>
					)}
					{onDeleteItem && (
						<Tooltip label={'Delete'}>
							<IconButton
								isRound
								icon={<Trash />}
								variant={'criticalIconButton'}
								aria-label={'delete-item'}
								onClick={onDeleteItem}
							/>
						</Tooltip>
					)}
				</HStack>
			)}
		</Flex>
	);
};
