import {EditableComboBox} from '@/components/ui/EditableComboBox';
import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
import {getAllItems} from '@/db/item';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {FormValues, Item, NewRentingItemFormValues, RentingItem} from '@/utils/data';

import {
	Button,
	Flex,
	HStack,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spacer,
	VStack
} from '@chakra-ui/react';
import {Check, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {UseFormRegister, UseFormSetValue, useForm} from 'react-hook-form';

export const AddRentingItemModal: React.FC<{
	title: string;
	getRemainingQuantityAtRecordCreationTime?: (item: Item) => number;
	handleConfirm?: (item: RentingItem, specificRemainingQuantity?: number) => void;
}> = ({title, handleConfirm, getRemainingQuantityAtRecordCreationTime}) => {
	const [items, setItems] = useState<Item[]>([]);
	const {addDisclosure, scanResultState} = useScanContext() as ReturnType<
		typeof useInitialScanContext
	>;
	const {isOpen, onClose} = addDisclosure;
	const [scanResult] = scanResultState;
	const cbItems: Item[] = items
		.filter((item) => {
			const currItem = item as Item;
			// Find item remaining quantity in db
			const dbRemainingQuantity =
				getRemainingQuantityAtRecordCreationTime?.(item) || (currItem.remainingQuantity as number);
			// Find scan result quantity, set 0 if not found in scan result
			const rentingItemQuantity =
				(scanResult?.find((scannedItem) => (scannedItem.item as Item).itemId === currItem.itemId)
					?.rentQuantity as number) || 0;

			// Check if item has reached max
			const hasItemReachedMaxQuantity = dbRemainingQuantity - rentingItemQuantity == 0;
			return !hasItemReachedMaxQuantity;
		})
		.map((item) => {
			const currItem = item as Item;

			return {
				itemId: currItem.itemId,
				itemName: currItem.itemName,
				itemImages: currItem.itemImages,
				itemQuantity: currItem.itemQuantity,
				createdAt: currItem.createdAt,
				createdBy: currItem.createdBy,
				itemStatus: currItem.itemStatus,
				remainingQuantity: currItem.remainingQuantity
			};
		});
	const [maxQuantity, setMaxQuantity] = useState<number>();
	const {watch, register, setValue} = useForm<NewRentingItemFormValues>();
	const {item, rentQuantity} = watch();

	const handleClose = () => {
		onClose();
	};

	const handleInitItems = async () => {
		const data = await getAllItems();
		setItems(data);
	};

	// Get all items from db on init
	useEffect(() => {
		handleInitItems();
	}, []);

	useEffect(() => {
		if (isOpen) {
			setValue('item', cbItems[0]);
			setValue('rentQuantity', 1);
		}
	}, [isOpen]);

	useEffect(() => {
		if (item) {
			setMaxQuantity(() => {
				if (
					rentQuantity &&
					item.remainingQuantity &&
					rentQuantity >
						(getRemainingQuantityAtRecordCreationTime?.(item) || item.remainingQuantity)
				) {
					setValue(
						'rentQuantity',
						getRemainingQuantityAtRecordCreationTime?.(item) || item.remainingQuantity
					);
				}
				const scannedQuantity = scanResult?.find(
					(scannedItem) => (scannedItem.item as Item).itemId === item.itemId
				)?.rentQuantity;

				return scannedQuantity
					? (((getRemainingQuantityAtRecordCreationTime?.(item) ||
							(item.remainingQuantity as number)) - (scannedQuantity as number)) as number)
					: getRemainingQuantityAtRecordCreationTime?.(item) || (item.remainingQuantity as number);
			});
		}
	}, [item]);

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<Heading fontSize={'lg'}>{title}</Heading>
						<Spacer />
						<HStack>
							<Button variant={'secondary'} leftIcon={<X />} onClick={handleClose}>
								Cancel
							</Button>
							<Button
								leftIcon={<Check />}
								onClick={() => {
									item &&
										rentQuantity &&
										handleConfirm?.(
											{
												item,
												rentQuantity
											},
											getRemainingQuantityAtRecordCreationTime?.(item)
										);
									handleClose();
								}}
							>
								Confirm
							</Button>
						</HStack>
					</Flex>
					<Flex flex={1} mt={5}>
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<VStack alignItems={'flex-start'}>
								<EditableComboBox
									isEditing
									label='Item'
									items={cbItems}
									placeholder='Search...'
									searchKey={'itemName'}
									itemIdKey={'itemId'}
									name={'item'}
									value={item?.itemName as string}
									setValue={setValue as UseFormSetValue<FormValues>}
								/>
							</VStack>
							<EditableNumberInput
								isEditing
								min={1}
								max={maxQuantity}
								name='rentQuantity'
								label={'Quantity'}
								value={rentQuantity as number}
								register={register as UseFormRegister<FormValues>}
								handleChange={(_, value) => setValue('rentQuantity', value)}
							/>
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
