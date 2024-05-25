import {RegisterFormVal2, RegisterFormValues} from '@/utils/context/RegisterContext';
import {formatDate} from '@/utils/utils';
import {Button} from '@chakra-ui/react';
import {ColumnDef, CustomFilterFns, FilterFn, Row} from '@tanstack/react-table';
import {DateRange} from 'react-day-picker';

export const UndefinedString = 'None';

// React hook form general types
export type FormValues = RegisterFormValues | RegisterFormVal2;
export type FormKeys = keyof RegisterFormValues | keyof RegisterFormVal2;

// DB Data Structure
// User
export type User = {
	id: string;
	name: string;
	email: string;
	status: string;
	type: string;
	createdAt: string | Date;
	lastRentalAt?: null;
};

// Table column structures
// User
declare module '@tanstack/table-core' {
	interface FilterFns {
		withinUserDateRange?: FilterFn<User>;
	}
}

export const userColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		enableGlobalFilter: true
	},
	{
		accessorKey: 'name',
		header: 'Name',
		enableGlobalFilter: true
	},
	{
		accessorKey: 'email',
		header: 'Email',
		enableGlobalFilter: true
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({row}) => formatDate(row.original.createdAt as Date),
		enableColumnFilter: true,
		filterFn: 'withinUserDateRange'
	},
	{
		accessorKey: 'status',
		header: 'Status',
		enableGlobalFilter: true
	},
	{
		id: 'actions',
		cell: ({row}) => {
			const user = row.original;

			if (user.status === 'active') return;

			return <Button fontSize={'sm'}>{user.name}</Button>;
		}
	}
];

// FILTERS
// User
export const userFilterFns: CustomFilterFns<User> = {
	withinUserDateRange: (row: Row<User>, columnId: string, filterValue: DateRange) => {
		const createdAt = row.getValue(columnId) as Date;
		const {from, to} = filterValue;

		if (!from) return false;

		if (from && !to) return createdAt >= from;

		if (from && to) return createdAt >= from && createdAt <= to;

		return true; // unused, important parts above
	}
};

// export type TableOrderBy = {
// 	[key: string]: 'asc' | 'desc' | undefined;
// };

// export type DateSubjectType = 'from' | 'to';
// export type DateRangeType = {
// 	from: Date;
// 	to: Date;
// };
