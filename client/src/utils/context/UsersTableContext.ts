import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {deleteUser, editUser, getAllAdmins, getAllUsers} from '@/db/user';
import {User} from '@/utils/data';
import {useDisclosure, useToast} from '@chakra-ui/react';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {SyntheticEvent, createContext, useContext, useState} from 'react';

// TABLE STRUCTURES
export const useInitialUserTableContext = (page: string = 'users') => {
	// Table data states
	const dataState = useState<User[] | undefined>(undefined);
	const selectedDataState = useState<User | undefined>(undefined);
	const tableState = useState<Table<User> | undefined>(undefined);
	const selectionDisclosure = useDisclosure(); // Selection actions modal
	const confirmDialogDisclosure = useDisclosure();
	const confirmDialogState = useState<Omit<ConfirmDialogProps, 'disclosure'>>({
		title: 'Are you sure?',
		description: '',
		onConfirm: () => {}
	});

	const [data, setData] = dataState;
	const [, setTable] = tableState;
	const {onClose} = selectionDisclosure;
	const [, setConfirmDialog] = confirmDialogState;

	const paginationState = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState = useState<RowSelectionState>({});

	// Filters
	const initialFilterValueState = useState<ColumnFiltersState>([
		// {
		// 	id: 'createdAt',
		// 	value: createNewDate(true)
		// }
	]);
	const [initialFilterValue] = initialFilterValueState;
	const initialSortingState = [{id: 'status', desc: true}];
	const searchTextState = useState('');
	const tableFiltersState = useState<ColumnFiltersState>(initialFilterValue);
	const tableSortingState = useState<SortingState>(initialSortingState);
	const toast = useToast();

	const handleInitTable = (table: Table<User>) => {
		setTable(table);
	};

	const refetch = async () => {
		const data = page == 'users' ? await getAllUsers() : await getAllAdmins();
		setData([...data]);
	};

	const handleSetActive = async (e: SyntheticEvent, user: User) => {
		e.stopPropagation();
		const {id, name} = user;
		confirmDialogDisclosure.onOpen();

		const handleEdit = async () => {
			try {
				await editUser(id, {status: 'active'});
				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'User status updated',
					description: `User ${name} has been set as active.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to update user status',
					description: `User ${name} status could not be updated, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set this user (${name}) as active?`,
				onConfirm: handleEdit
			};
		});
	};

	const handleDelete = (e: SyntheticEvent, user: User) => {
		e.stopPropagation();
		const {id, name} = user;
		confirmDialogDisclosure.onOpen();

		const handleDelete = async () => {
			try {
				// TODO: Send general (reject or delete) email to user notifying deletion
				await deleteUser(id);
				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'User removed',
					description: `User ${name} has been removed from the system.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to remove user',
					description: `User ${name} could not be removed, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject this user (${name})?`,
				onConfirm: handleDelete
			};
		});
	};

	const handleSetActiveForRows = (users: User[]) => {
		// TODO
		confirmDialogDisclosure.onOpen();

		const handleEdit = async () => {
			try {
				for (const user of users) {
					const {id} = user;
					await editUser(id, {status: 'active'});
				}

				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'User statuses updated',
					description: `Selected users have been set as active.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to update user statuses',
					description: `Selected user statuses could not be updated, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set all selected users as active?`,
				onConfirm: handleEdit
			};
		});
	};

	const handleDeleteForRows = (users: User[]) => {
		confirmDialogDisclosure.onOpen();

		const handleDelete = async () => {
			try {
				for (const user of users) {
					const {id} = user;
					// TODO: Send general (reject or delete) email to user notifying deletion
					await deleteUser(id);
				}

				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Users removed',
					description: `Selected users have been removed from the system.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to remove users',
					description: `Selected users could not be removed, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to remove selected users?`,
				onConfirm: handleDelete
			};
		});
	};

	// const handleLoadMore = () => {
	// For lazy load
	// 	setCurrLimit((prev) => {
	// 		const newLimit = prev + limit;
	// 		setData(initData?.slice(0, newLimit));

	// 		return newLimit;
	// 	});
	// };

	// const handleLimitChange = (limit: number) => {
	// 	table?.setPageSize(limit);
	// 	setLimit(limit);
	// 	// setCurrLimit(limit); For lazy load
	// };

	return {
		// DATA
		data,
		dataState,
		selectedDataState,
		tableState,
		paginationState,
		rowSelectionState,
		selectionDisclosure,
		confirmDialogState,
		confirmDialogDisclosure,

		// FILTERS
		initialFilterValueState,
		initialSortingState,
		searchTextState, // Global filter search
		tableFiltersState,
		tableSortingState,
		handleInitTable,
		refetch,
		// ACTIONS
		handleSetActive,
		handleDelete,
		handleSetActiveForRows,
		handleDeleteForRows
	};
};

// const data: User[] = [
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date('2024-05-24T13:04:25.079Z'),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 1,
// 		name: 'John Doe',
// 		email: 'john@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 12,
// 		name: 'Johnq Doe',
// 		email: 'johnq@gmail.com',
// 		status: 'active',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	},
// 	{
// 		id: 3,
// 		name: 'Johna Doe',
// 		email: 'johna@gmail.com',
// 		status: 'pending',
// 		type: 'user',
// 		createdAt: new Date(),
// 		imageUrls: []
// 	}
// ];

export const UserTableContext = createContext<
	ReturnType<typeof useInitialUserTableContext> | undefined
>(undefined);

export const useUserTableContext = () => useContext(UserTableContext);
