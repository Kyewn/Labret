import {User, mapUserStatus} from '@/utils/data';
import {formatDate} from '@/utils/utils';
import {Button, ButtonGroup, Checkbox, Flex, IconButton} from '@chakra-ui/react';
import {ColumnDef, CustomFilterFns, FilterFn, Row} from '@tanstack/react-table';
import {ArrowBigDown, ArrowBigUp, Trash} from 'lucide-react';
import {SyntheticEvent} from 'react';
import {DateRange} from 'react-day-picker';

// Table column structures
// User
declare module '@tanstack/table-core' {
	interface FilterFns {
		withinUserDateRange?: FilterFn<User>;
	}
}

export const getUserColumns: (
	openSelectionModal: () => void,
	closeSelectionModal: () => void,
	handlePrimaryClick: (e: SyntheticEvent, userId: string) => void,
	handleSecondaryClick: (e: SyntheticEvent, userId: string) => void,
	handleDelete: (e: SyntheticEvent, userId: string) => void
) => ColumnDef<User>[] = (
	openSelectionModal,
	closeSelectionModal,
	handlePrimaryClick,
	handleSecondaryClick,
	handleDelete
) => [
	{
		id: 'select',
		header: ({table}) => (
			<Flex>
				<Checkbox
					isChecked={table.getIsSomeRowsSelected()}
					onChange={(e) => {
						// Only select pending rows
						const rows = table.getCoreRowModel().rows;
						rows.forEach((row) => {
							if (row.original.status === 'pending') row.toggleSelected(!!e.target.checked);
						});
						if (e.target.checked) openSelectionModal();
						else closeSelectionModal();
					}}
					aria-label='Select all'
				/>
			</Flex>
		),
		cell: ({row}) =>
			row.original.status == 'pending' && (
				<Flex>
					<Checkbox
						isChecked={row.getIsSelected()}
						onChange={() => {
							row.toggleSelected(!row.getIsSelected());
						}}
						aria-label='Select row'
					/>
				</Flex>
			)
	},
	{
		accessorKey: 'id',
		header: ({column}) => {
			return (
				<Button
					variant={'ghost'}
					fontSize={'sm'}
					onClick={() => {
						column.toggleSorting(column.getIsSorted() == 'asc');
					}}
					rightIcon={column.getIsSorted() == 'asc' ? <ArrowBigUp /> : <ArrowBigDown />}
				>
					ID
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'name',
		header: ({column}) => {
			return (
				<Button
					variant={'ghost'}
					fontSize={'sm'}
					onClick={() => {
						column.toggleSorting(column.getIsSorted() == 'asc');
					}}
					rightIcon={column.getIsSorted() == 'asc' ? <ArrowBigUp /> : <ArrowBigDown />}
				>
					Name
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'email',
		header: ({column}) => {
			return (
				<Button
					variant={'ghost'}
					fontSize={'sm'}
					onClick={() => {
						column.toggleSorting(column.getIsSorted() == 'asc');
					}}
					rightIcon={column.getIsSorted() == 'asc' ? <ArrowBigUp /> : <ArrowBigDown />}
				>
					Email
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'createdAt',
		header: ({column}) => {
			return (
				<Button
					variant={'ghost'}
					fontSize={'sm'}
					onClick={() => {
						column.toggleSorting(column.getIsSorted() == 'asc');
					}}
					rightIcon={column.getIsSorted() == 'asc' ? <ArrowBigUp /> : <ArrowBigDown />}
				>
					Created At
				</Button>
			);
		},
		cell: ({row}) => formatDate(row.original.createdAt as Date),
		enableColumnFilter: true,
		filterFn: 'withinUserDateRange'
	},
	{
		accessorKey: 'status',
		header: ({column}) => {
			return (
				<Button
					variant={'ghost'}
					fontSize={'sm'}
					onClick={() => {
						column.toggleSorting(column.getIsSorted() == 'asc');
					}}
					rightIcon={column.getIsSorted() == 'asc' ? <ArrowBigUp /> : <ArrowBigDown />}
				>
					Status
				</Button>
			);
		},
		cell: ({row}) => mapUserStatus(row.original.status),
		enableGlobalFilter: true
	},
	{
		id: 'actions',
		header: 'ACTIONS',
		cell: ({row}) => {
			const user = row.original;

			if (user.status === 'active') return;

			return (
				<ButtonGroup>
					<Button
						fontSize={'sm'}
						onClick={(e) => handlePrimaryClick(e, (user.id as string) || user.id.toString())}
					>
						Set Active
					</Button>
					<Button
						variant={'secondary'}
						onClick={(e) => handleSecondaryClick(e, (user.id as string) || user.id.toString())}
					>
						Reject
					</Button>
				</ButtonGroup>
			);
		}
	},
	{
		id: 'delete',
		cell: ({row}) => {
			const user = row.original;

			return (
				<IconButton
					aria-label={'delete'}
					icon={<Trash />}
					variant={'criticalOutline'}
					onClick={(e) => handleDelete(e, (user.id as string) || user.id.toString())}
				/>
			);
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
