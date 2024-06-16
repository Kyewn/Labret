import {ComboBox} from '@/components/ui/ComboBox';
import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
import {FormValues, NewRentedItemFormValues, RentedItem} from '@/utils/data';

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
	VStack,
	useDisclosure
} from '@chakra-ui/react';
import {Check, X} from 'lucide-react';
import {UseFormRegister, useForm} from 'react-hook-form';

export const NewItemInfoModal: React.FC<{
	title: string;
	selectedItem?: RentedItem;
	disclosure: ReturnType<typeof useDisclosure>;
	handleConfirmNewItemInfo?: (item: RentedItem) => void;
}> = ({title, selectedItem, disclosure, handleConfirmNewItemInfo}) => {
	const items: RentedItem[] = [
		{
			item: {
				itemId: '1',
				itemName: 'item1',
				itemImages: '',
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
				itemImages: '',
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
				itemImages: '',
				itemQuantity: 0,
				itemCategory: undefined,
				itemDescription: undefined,
				createdAt: undefined,
				createdBy: undefined
			},
			rentQuantity: 30
		}
	];
	const {isOpen, onClose} = disclosure;
	const {watch, register, setValue} = useForm<NewRentedItemFormValues>();
	const {item, rentQuantity} = watch();

	return (
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<Heading fontSize={'lg'}>{title}</Heading>
						<Spacer />
						<HStack>
							<Button variant={'secondary'} leftIcon={<X />} onClick={onClose}>
								Cancel
							</Button>
							<Button
								leftIcon={<Check />}
								onClick={() => {
									item &&
										rentQuantity &&
										handleConfirmNewItemInfo?.({
											item,
											rentQuantity
										});
									onClose();
								}}
							>
								Confirm
							</Button>
						</HStack>
					</Flex>
					<Flex flex={1} mt={5}>
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<ComboBox
								items={items}
								searchKey={'name'}
								itemIdKey={'id'}
								name={'itemName'}
								value={(item?.itemName || selectedItem?.item.itemName) as string}
								setValue={setValue}
							/>
							<EditableNumberInput
								name='rentedQuantity'
								label={'Quantity'}
								value={(rentQuantity || selectedItem?.rentQuantity) as number}
								register={register as UseFormRegister<FormValues>}
							/>
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
