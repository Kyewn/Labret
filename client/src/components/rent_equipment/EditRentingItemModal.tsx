import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {FormValues, NewRentingItemFormValues, RentingItem} from '@/utils/data';

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

export const EditRentingItemModal: React.FC<{
	title: string;
	handleConfirm?: (item: RentingItem) => void;
}> = ({title, handleConfirm}) => {
	// FIXME: Fetch from db
	const {editDisclosure, selectedItemState} = useScanContext() as ReturnType<
		typeof useInitialScanContext
	>;
	const {isOpen, onClose} = editDisclosure;
	const [selectedItem] = selectedItemState;
	const {watch, register, setValue} = useForm<NewRentingItemFormValues>();
	const {item, rentQuantity} = watch();

	const handleClose = () => {
		onClose();
	};

	useEffect(() => {
		if (isOpen && selectedItem) {
			setValue('item', selectedItem.item);
			setValue('rentQuantity', selectedItem.rentQuantity as number);
		}
	}, [isOpen, selectedItem]);

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
								<Text>{selectedItem?.item.itemName}</Text>
							</VStack>
							<EditableNumberInput
								isEditing
								min={1}
								name='rentQuantity'
								label={'Quantity'}
								value={selectedItem?.rentQuantity as number}
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
