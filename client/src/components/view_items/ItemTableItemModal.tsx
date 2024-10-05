import {EditableComboBox} from '@/components/ui/EditableComboBox';
import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
import ImageManager from '@/components/ui/ImageManager';
import {editItem} from '@/db/item';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialItemTableContext, useItemTableContext} from '@/utils/context/ItemTableContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {
	FormValues,
	Item,
	ItemEditableFields,
	ItemInfoValues,
	User,
	mapUserStatus
} from '@/utils/data';

import {
	Button,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Spacer,
	Tag,
	VStack,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import {Check, Edit, X} from 'lucide-react';
import {FormProvider, UseFormRegister, UseFormSetValue, useForm} from 'react-hook-form';

export const ItemTableItemModal: React.FC<{
	multiEditableContext: ReturnType<typeof useMultiEditableContext>;
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({multiEditableContext, disclosure}) => {
	const {
		appState: {pageLoading},
		appDispatch
	} = useAppContext();
	const toast = useToast();
	const {isOpen, onClose} = disclosure;
	const {dataState, refetch} = useItemTableContext() as ReturnType<
		typeof useInitialItemTableContext
	>;
	const {data: selectedItem} = multiEditableContext;
	const [items] = dataState;
	const formContext = useForm<ItemInfoValues>();
	const {
		watch,
		setValue,
		register,
		handleSubmit,
		clearErrors,
		reset,
		formState: {errors}
	} = formContext;
	const {itemName, itemQuantity, itemCategory, itemDescription} = watch();

	const itemCategories =
		(items
			?.map((item) => item.itemCategory)
			.filter((category, i, arr) => category && arr.indexOf(category) === i) as string[]) || [];

	const handleEdit = async () => {
		const mHandleEdit = async (newData: ItemEditableFields) => {
			const editRecord = async () => {
				await editItem((selectedItem as Item | undefined)?.itemId as string, {
					...newData,
					createdAt: (newData.createdAt as Date).toISOString(),
					...(newData.createdBy && {createdBy: (newData.createdBy as User).id})
				});
				refetch();
				return true;
			};
			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			// Duplicated created due to execution in .promise behavior + multiEditableContext.onSubmit
			// Require id for toast checking
			const toastId = 'confirmEditItem';
			if (!toast.isActive(toastId)) {
				toast.promise(editRecord(), {
					loading: {
						id: toastId,
						description: 'Saving...'
					},
					success: {
						id: toastId,
						description: 'Record has been updated!',
						duration: 3000
					},
					error: {
						id: toastId,
						description: 'Failed to save changes, please try again.',
						duration: 3000
					}
				});
			}
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
		};
		multiEditableContext.onSubmit(async (nNewData) => await mHandleEdit(nNewData as Item));
	};

	const getStatusColor = (status: string) => {
		const lcStatus = status.toLowerCase();
		if (lcStatus.includes('active')) {
			return 'green';
		} else {
			return 'yellow';
		}
	};

	return (
		<Modal
			scrollBehavior={'inside'}
			isOpen={isOpen}
			onClose={onClose}
			closeOnOverlayClick={!multiEditableContext.isEditing}
		>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'75%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<HStack spacing={5}>
							<Tag colorScheme={'orange'} fontWeight={'bold'}>
								ID {(selectedItem as Item | undefined)?.itemId as string}
							</Tag>
							{(selectedItem as Item | undefined)?.itemStatus && (
								<Tag
									colorScheme={getStatusColor(
										(selectedItem as Item | undefined)?.itemStatus as string
									)}
								>
									{mapUserStatus((selectedItem as Item | undefined)?.itemStatus as string)}
								</Tag>
							)}
						</HStack>
						<Spacer />
						{multiEditableContext.isEditing ? (
							<HStack>
								<Button
									disabled={pageLoading}
									variant={'secondary'}
									leftIcon={<X />}
									onClick={() => {
										clearErrors();
										reset();
										multiEditableContext.onCancel();
									}}
								>
									Cancel
								</Button>
								<Button type={'submit'} form='form' isLoading={pageLoading} leftIcon={<Check />}>
									Confirm
								</Button>
							</HStack>
						) : (
							<Button leftIcon={<Edit />} onClick={multiEditableContext.onEdit}>
								Edit
							</Button>
						)}
					</Flex>
					<Flex width={'100%'} flex={1} mt={5}>
						<FormProvider {...formContext}>
							<form id='form' style={{flex: 1}} onSubmit={handleSubmit(handleEdit)}>
								<VStack
									spacing={5}
									width={'100%'}
									justifyContent={'flex-start'}
									alignItems={'flex-start'}
								>
									<Flex width={'100%'}>
										<HStack flex={1} spacing={5}>
											<VStack
												spacing={5}
												height={'100%'}
												flex={1}
												justifyItems={'flex-start'}
												alignItems={'flex-start'}
											>
												<EditableField
													name='itemName'
													label={'Label'}
													value={itemName || (selectedItem as Item | undefined)?.itemName}
													isEditing={multiEditableContext.isEditing}
													register={register as UseFormRegister<FormValues>}
													rules={{required: 'Label is required'}}
													errorMessage={errors.itemName?.message}
													handleChange={multiEditableContext.onChange}
												/>
												<EditableField
													useTextArea
													name='itemDescription'
													label={'Description'}
													value={
														itemDescription || (selectedItem as Item | undefined)?.itemDescription
													}
													isEditing={multiEditableContext.isEditing}
													register={register as UseFormRegister<FormValues>}
													handleChange={multiEditableContext.onChange}
												/>
												<EditableNumberInput
													name='itemQuantity'
													label={'Quantity'}
													min={1}
													value={
														(itemQuantity as number) ||
														((selectedItem as Item | undefined)?.itemQuantity as number)
													}
													isEditing={multiEditableContext.isEditing}
													register={register as UseFormRegister<FormValues>}
													handleChange={(_, value) => setValue('itemQuantity', value)}
													handleMEContextChange={multiEditableContext.onChange}
												/>
											</VStack>
											<VStack
												height={'100%'}
												spacing={5}
												flex={1}
												justifyItems={'flex-start'}
												alignItems={'flex-start'}
											>
												<EditableComboBox
													isCreateNewOnNoneEnabled
													name='itemCategory'
													label={'Category'}
													placeholder='Choose category'
													items={itemCategories}
													initValue={(selectedItem as Item | undefined)?.itemCategory}
													value={itemCategory || (selectedItem as Item | undefined)?.itemCategory}
													isEditing={multiEditableContext.isEditing}
													handleChange={(item) =>
														multiEditableContext.onChange({itemCategory: item as string})
													}
													setValue={setValue as UseFormSetValue<FormValues>}
												/>
												<EditableDate
													label={'Creation Date'}
													name='createdAt'
													value={(selectedItem as Item | undefined)?.createdAt as Date}
												/>
												<EditableField
													label={'Created By'}
													name='createdBy'
													value={
														((selectedItem as Item | undefined)?.createdBy as User | undefined)
															?.name
													}
												/>
											</VStack>
										</HStack>
									</Flex>
									<Flex w={'50%'}>
										<ImageManager
											label='Item images'
											specifiedImages={(selectedItem as Item | undefined)?.itemImages}
										/>
									</Flex>
								</VStack>
							</form>
						</FormProvider>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
