import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import ImageManager from '@/components/ui/ImageManager';
import {editUser} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {useInitialUserTableContext, useUserTableContext} from '@/utils/context/UsersTableContext';
import {FormValues, User, UserInfoValues, mapUserStatus} from '@/utils/data';

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
import {UseFormRegister, useForm} from 'react-hook-form';

export const UserItemModal: React.FC<{
	multiEditableContext: ReturnType<typeof useMultiEditableContext>;
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({multiEditableContext, disclosure}) => {
	const {
		appState: {pageLoading},
		appDispatch
	} = useAppContext();
	const toast = useToast();
	const {isOpen, onClose} = disclosure;
	const {refetch} = useUserTableContext() as ReturnType<typeof useInitialUserTableContext>;
	const {data: selectedUser} = multiEditableContext;
	const {
		register,
		handleSubmit,
		clearErrors,
		reset,
		formState: {errors}
	} = useForm<UserInfoValues>();

	const handleEdit = async () => {
		const mHandleEdit = async (newData: User) => {
			const editRecord = async () => {
				await editUser((selectedUser?.id as number).toString(), {
					...newData,
					createdAt: (newData.createdAt as Date).toISOString()
				});
				refetch();
				return true;
			};

			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			// Duplicated created due to execution in .promise behavior + multiEditableContext.onSubmit
			// Require id for toast checking
			const toastId = 'confirmEditRepairItem';
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
		multiEditableContext.onSubmit(async (nNewData) => await mHandleEdit(nNewData));
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
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<Flex>
						<HStack spacing={5}>
							<Tag colorScheme={'orange'} fontWeight={'bold'}>
								ID {selectedUser?.id}
							</Tag>
							{selectedUser?.status && (
								<Tag colorScheme={getStatusColor(selectedUser?.status)}>
									{mapUserStatus(selectedUser?.status)}
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
					<Flex flex={1} mt={5}>
						<form id='form' onSubmit={handleSubmit(handleEdit)}>
							<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
								<EditableField
									name='name'
									label={'Name'}
									value={selectedUser?.name}
									isEditing={multiEditableContext.isEditing}
									register={register as UseFormRegister<FormValues>}
									rules={{required: 'Name is required'}}
									errorMessage={errors.name?.message}
									handleChange={multiEditableContext.onChange}
								/>
								<EditableField
									name='email'
									label={'Email'}
									value={selectedUser?.email}
									isEditing={multiEditableContext.isEditing}
									register={register as UseFormRegister<FormValues>}
									rules={{required: 'Email is required'}}
									errorMessage={errors.email?.message}
									handleChange={multiEditableContext.onChange}
								/>
								<EditableDate
									label={'Creation Date'}
									name='createdAt'
									value={selectedUser?.createdAt as Date}
								/>
								<ImageManager specifiedImages={selectedUser?.imageUrls} />
							</VStack>
						</form>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
