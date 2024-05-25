import {User} from '@/utils/dataType';
import {ColumnFiltersState, SortingState, Table} from '@tanstack/react-table';
import {addDays} from 'date-fns';
import {createContext, useState} from 'react';

// TABLE STRUCTURES
export const useUsersTableContext = () => {
	// Table data states
	const initDataState = useState<User[] | undefined>(undefined);
	const dataState = useState<User[] | undefined>(undefined);
	const tableState = useState<Table<User> | undefined>(undefined);
	const limitState = useState(10);
	const currLimitState = useState(10);

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
	const searchTextState = useState('');
	const tableFiltersState = useState<ColumnFiltersState>(initialFilterState);
	const tableSortingState = useState<SortingState>([]);

	const [initData, setInitData] = initDataState;
	const [, setData] = dataState;
	const [, setTable] = tableState;
	const [limit, setLimit] = limitState;
	const [, setCurrLimit] = currLimitState;

	const handleInitTable = (table: Table<User>) => {
		setTable(table);
	};

	const refetch = (mLimit: number) => {
		const data: User[] = [
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2024-05-24T13:04:25.079Z')
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '1',
				name: 'John Doe',
				email: 'john@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '12',
				name: 'Johnq Doe',
				email: 'johnq@gmail.com',
				status: 'active',
				type: 'user',
				createdAt: new Date()
			},
			{
				id: '3',
				name: 'Johna Doe',
				email: 'johna@gmail.com',
				status: 'pending',
				type: 'user',
				createdAt: new Date()
			}
		];

		setInitData(data);
		setData(data.slice(0, mLimit));
	};

	const handleLoadMore = () => {
		setCurrLimit((prev) => {
			const newLimit = prev + limit;
			setData(initData?.slice(0, newLimit));

			return newLimit;
		});
	};

	const handleLimitChange = (limit: number) => {
		setLimit(limit);
		setCurrLimit(limit);
	};

	return {
		// DATA
		dataState,
		tableState,
		limitState,
		currLimitState,
		// FILTERS
		initialFilterState,
		searchTextState,
		tableFiltersState,
		tableSortingState,
		handleInitTable,
		refetch,
		handleLoadMore,
		handleLimitChange
	};
};

export const UserTableContext = createContext<ReturnType<typeof useUsersTableContext> | undefined>(
	undefined
);
