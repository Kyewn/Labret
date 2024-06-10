import {User} from '@/utils/data';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {addDays} from 'date-fns';
import {SyntheticEvent, createContext, useState} from 'react';

// TABLE STRUCTURES
export const useUserTableContext = () => {
	// Table data states
	const dataState = useState<User[] | undefined>(undefined);
	const selectedDataState = useState<User | undefined>(undefined);
	const tableState = useState<Table<User> | undefined>(undefined);
	const [, setData] = dataState;
	const [, setTable] = tableState;
	const paginationState = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState = useState<RowSelectionState>({});

	// Filters
	const getInitDate = () => {
		const fromDate = new Date();
		fromDate.setHours(0, 0, 0, 0);
		const toDate = addDays(new Date(), 20);
		toDate.setHours(23, 59, 59, 999);

		return {
			from: fromDate,
			to: toDate
		};
	};
	const initialFilterState = [
		{
			id: 'createdAt',
			value: getInitDate()
		}
	];
	const initialSortingState = [{id: 'status', desc: true}];
	const searchTextState = useState('');
	const tableFiltersState = useState<ColumnFiltersState>(initialFilterState);
	const tableSortingState = useState<SortingState>(initialSortingState);

	const handleInitTable = (table: Table<User>) => {
		setTable(table);
	};

	const refetch = () => {
		const data: User[] = [
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2024-05-24T13:04:25.079Z'),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 1,
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 12,
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			},
			{
				id: 3,
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date(),
				imageUrls: []
			}
		];

		setData(data);
	};

	const handleSetActive = (e: SyntheticEvent, userId: string) => {
		// TODO
		e.stopPropagation();
		console.log(userId);
	};

	const handleReject = (e: SyntheticEvent, userId: string) => {
		// TODO
		e.stopPropagation();
		console.log(userId);
	};

	const handleDelete = (e: SyntheticEvent, userId: string) => {
		// TODO
		e.stopPropagation();
		console.log(userId);
	};

	const handleSetActiveForRows = (rowIds: string[]) => {
		// TODO
		console.log(rowIds);
	};

	const handleRejectForRows = (rowIds: string[]) => {
		// TODO
		console.log(rowIds);
	};

	const handleDeleteForRows = (rowIds: string[]) => {
		// TODO
		console.log(rowIds);
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
		dataState,
		selectedDataState,
		tableState,
		paginationState,
		rowSelectionState,
		// FILTERS
		initialFilterState,
		initialSortingState,
		searchTextState, // Global filter search
		tableFiltersState,
		tableSortingState,
		handleInitTable,
		refetch,
		// ACTIONS
		handleSetActive,
		handleReject,
		handleDelete,
		handleSetActiveForRows,
		handleRejectForRows,
		handleDeleteForRows
	};
};

export const UserTableContext = createContext<ReturnType<typeof useUserTableContext> | undefined>(
	undefined
);
