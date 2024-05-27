import {EditableDate} from '@/components/ui/EditableDate';
import {EditableField} from '@/components/ui/EditableField';
import {editUser} from '@/db/user';
import {useAppContext} from '@/utils/context/AppContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {useUserTableContext} from '@/utils/context/UsersTableContext';
import {User, mapUserStatus} from '@/utils/data';

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

export const UserRecordModal: React.FC<{
	multiEditableContext: ReturnType<typeof useMultiEditableContext>;
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({multiEditableContext, disclosure}) => {
	const {
		appState: {pageLoading},
		appDispatch
	} = useAppContext();
	const {isOpen, onClose} = disclosure;

	const userTableContext = useUserTableContext();
	const {refetch} = userTableContext as ReturnType<typeof useUserTableContext>;
	const data = multiEditableContext.data as User;

	const toast = useToast();

	const handleSubmit = async (newData: User) => {
		const editRecord = editUser((data?.id as number).toString(), newData);
		// fetch(`https://hydrorise-sentinel-j5ag.onrender.com/${newData.id}`, {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Access-Control-Allow-Origin': '*',
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		...newData,
		// 		...(newData.dt_opened ? {dt_opened: new Date(newData.dt_opened).toISOString()} : undefined),
		// 		...(newData.dt_closed ? {dt_closed: new Date(newData.dt_closed).toISOString()} : undefined),
		// 		...(newData.dt_wo_creation
		// 			? {dt_wo_creation: new Date(newData.dt_wo_creation).toISOString()}
		// 			: undefined)
		// 	})
		// });
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		// Duplicated created due to execution in .promise behavior + multiEditableContext.onSubmit
		// Require id for toast checking
		const toastId = 'confirmEditRepairItem';
		if (!toast.isActive(toastId)) {
			toast.promise(editRecord, {
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
		await refetch();
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	// const getStatusColor = (status: string) => {
	// 	const lcStatus = status.toLowerCase();
	// 	if (lcStatus.includes('complete')) {
	// 		return 'green';
	// 	} else if (lcStatus.includes('cancel')) {
	// 		return 'red';
	// 	} else {
	// 		return 'yellow';
	// 	}
	// };

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
								ID {data?.id}
							</Tag>
							{data?.status && (
								<Tag colorScheme={getStatusColor(data?.status)}>{mapUserStatus(data?.status)}</Tag>
							)}
						</HStack>
						<Spacer />
						{multiEditableContext.isEditing ? (
							<HStack>
								<Button
									disabled={pageLoading}
									variant={'secondary'}
									leftIcon={<X />}
									onClick={multiEditableContext.onCancel}
								>
									Cancel
								</Button>
								<Button
									isLoading={pageLoading}
									leftIcon={<Check />}
									onClick={() => multiEditableContext.onSubmit(handleSubmit)}
								>
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
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<EditableField
								name='name'
								label={'Name'}
								value={data?.name}
								isEditing={multiEditableContext.isEditing}
								handleChange={multiEditableContext.onChange}
							/>
							<EditableField
								name='email'
								label={'Email'}
								value={data?.email}
								isEditing={multiEditableContext.isEditing}
								handleChange={multiEditableContext.onChange}
							/>
							<EditableDate
								label={'Creation Date'}
								name='createdAt'
								value={data?.createdAt as Date}
								isEditing={multiEditableContext.isEditing}
								handleChange={multiEditableContext.onChange}
							/>
							{/* TODO Image viewer */}
						</VStack>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
