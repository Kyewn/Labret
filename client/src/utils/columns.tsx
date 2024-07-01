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
	handleSetActive: (e: SyntheticEvent, user: User) => void,
	handleDelete: (e: SyntheticEvent, user: User) => void,
	isViewAdminPage?: boolean
) => ColumnDef<User>[] = (
	openSelectionModal,
	closeSelectionModal,
	handleSetActive,
	handleDelete,
	isViewAdminPage = false
) => [
	{
		id: 'select',
		header: ({table}) => (
			<Flex>
				<Checkbox
					isChecked={table.getIsAllRowsSelected()}
					onChange={(e) => {
						// Only select pending rows
						const rows = table.getCoreRowModel().rows;
						const hasPendingRows = rows.some((row) => row.original.status === 'pending');
						rows.forEach((row) => {
							if (row.original.status === 'pending') row.toggleSelected(!!e.target.checked);
						});
						if (e.target.checked && hasPendingRows) openSelectionModal();
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
	...(isViewAdminPage
		? ([
				{
					accessorKey: 'createdBy',
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
								Created By
							</Button>
						);
					},
					cell: ({row}) => (row.original.createdBy as User).name,
					enableGlobalFilter: true
				}
		  ] as ColumnDef<User>[])
		: []),
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
					<Button fontSize={'sm'} onClick={(e) => handleSetActive(e, user)}>
						Set Active
					</Button>
					<Button variant={'secondary'} onClick={(e) => handleDelete(e, user)}>
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

			if (user.status === 'pending') return;

			return (
				<IconButton
					aria-label={'delete'}
					icon={<Trash />}
					variant={'criticalOutline'}
					onClick={(e) => handleDelete(e, user)}
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
