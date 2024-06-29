import {ComboBox} from '@/components/ui/ComboBox';
import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
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
	Text,
	VStack
} from '@chakra-ui/react';
import {Check, X} from 'lucide-react';
import {useEffect} from 'react';
import {UseFormRegister, useForm} from 'react-hook-form';

export const AddRentingItemModal: React.FC<{
	title: string;
	handleConfirm?: (item: RentingItem) => void;
}> = ({title, handleConfirm}) => {
	// FIXME: Fetch from db
	const items: RentingItem[] = [
		{
			item: {
				itemId: '1',
				itemName: 'item1',
				itemImages: [],
				itemQuantity: 0,
				itemCategory: undefined,
				itemDescription: undefined,
				createdAt: undefined,
				createdBy: undefined
			},
			rentQuantity: 10
		},
		{
			item: {
				itemId: '2',
				itemName: 'item2',
				itemImages: [],
				itemQuantity: 0,
				itemCategory: undefined,
				itemDescription: undefined,
				createdAt: undefined,
				createdBy: undefined
			},
			rentQuantity: 20
		},
		{
			item: {
				itemId: '3',
				itemName: 'item3',
				itemImages: [],
				itemQuantity: 0,
				itemCategory: undefined,
				itemDescription: undefined,
				createdAt: undefined,
				createdBy: undefined
			},
			rentQuantity: 30
		}
	];
	const cbItems: Item[] = items.map((item) => ({
		itemId: item.item.itemId,
		itemName: item.item.itemName,
		itemImages: item.item.itemImages,
		itemQuantity: item.item.itemQuantity
	}));
	const {addDisclosure} = useScanContext() as ReturnType<typeof useInitialScanContext>;
	const {isOpen, onClose} = addDisclosure;
	const {watch, register, setValue} = useForm<NewRentingItemFormValues>();
	const {item, rentQuantity} = watch();

	const handleClose = () => {
		onClose();
	};

	useEffect(() => {
		if (isOpen) {
			setValue('item', cbItems[0]);
			setValue('rentQuantity', 1);
		}
	}, [isOpen]);

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
										handleConfirm?.({
											item,
											rentQuantity
										});
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
								<Text fontWeight={700} fontSize={'sm'}>
									Item
								</Text>
								<ComboBox
									items={cbItems}
									searchKey={'itemName'}
									itemIdKey={'itemId'}
									name={'item'}
									value={item?.itemName as string}
									setValue={setValue}
								/>
							</VStack>
							<EditableNumberInput
								isEditing
								min={1}
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