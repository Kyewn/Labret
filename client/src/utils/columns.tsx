import {RentalRecord, TableData, User, mapRecordStatus, mapUserStatus} from '@/utils/data';
import {formatDate} from '@/utils/utils';
import {Button, ButtonGroup, Checkbox, Flex, IconButton} from '@chakra-ui/react';
import {ColumnDef, CustomFilterFns, FilterFn, Row} from '@tanstack/react-table';
import {ArrowBigDown, ArrowBigUp, Check, Trash} from 'lucide-react';
import {SyntheticEvent} from 'react';
import {DateRange} from 'react-day-picker';

// Table column structures
// User
declare module '@tanstack/table-core' {
	interface FilterFns {
		withinDateRange?: FilterFn<TableData>;
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
		filterFn: 'withinDateRange'
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

export const getUserHistoryActiveRecordColumns: () => ColumnDef<RentalRecord>[] = () => [
	{
		accessorKey: 'recordId',
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
		accessorKey: 'recordTitle',
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
					Record Title
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'rentedAt',
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
					Rented At
				</Button>
			);
		},
		cell: ({row}) => (row.original.rentedAt ? formatDate(row.original.rentedAt as Date) : '--'),
		enableGlobalFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'expectedReturnAt',
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
					Expected Return At
				</Button>
			);
		},
		cell: ({row}) =>
			row.original.expectedReturnAt ? formatDate(row.original.expectedReturnAt as Date) : '--',
		enableColumnFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'recordStatus',
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
		cell: ({row}) => mapRecordStatus(row.original.recordStatus),
		enableGlobalFilter: true
	},
	{
		accessorKey: 'isReverify',
		header: () => 'Reverifying',
		cell: ({row}) =>
			row.original.recordStatus === 'rent_reverifying' ||
			row.original.recordStatus === 'return_reverifying' ? (
				<Check />
			) : null
	}
];

export const getUserHistoryCompletedRecordColumns: () => ColumnDef<RentalRecord>[] = () => [
	{
		accessorKey: 'recordId',
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
		accessorKey: 'recordTitle',
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
					Record Title
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'rentedAt',
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
					Rented At
				</Button>
			);
		},
		cell: ({row}) => (row.original.rentedAt ? formatDate(row.original.rentedAt as Date) : '--'),
		enableGlobalFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'expectedReturnAt',
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
					Expected Return At
				</Button>
			);
		},
		cell: ({row}) =>
			row.original.expectedReturnAt ? formatDate(row.original.expectedReturnAt as Date) : '--',
		enableColumnFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'returnedAt',
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
					Returned At
				</Button>
			);
		},
		cell: ({row}) => (row.original.returnedAt ? formatDate(row.original.returnedAt as Date) : '--'),
		enableColumnFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'recordStatus',
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
		cell: ({row}) => mapRecordStatus(row.original.recordStatus),
		enableGlobalFilter: true
	}
];

export const getUserHistoryRejectedRecordColumns: () => ColumnDef<RentalRecord>[] = () => [
	{
		accessorKey: 'recordId',
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
		accessorKey: 'recordTitle',
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
					Record Title
				</Button>
			);
		},
		enableGlobalFilter: true
	},
	{
		accessorKey: 'rentedAt',
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
					Rented At
				</Button>
			);
		},
		cell: ({row}) => (row.original.rentedAt ? formatDate(row.original.rentedAt as Date) : '--'),
		enableGlobalFilter: true,
		filterFn: 'withinDateRange'
	},
	{
		accessorKey: 'recordStatus',
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
		cell: ({row}) => mapRecordStatus(row.original.recordStatus),
		enableGlobalFilter: true
	}
];

// FILTERS
// User
export const userFilterFns: CustomFilterFns<TableData> = {
	withinDateRange: (row: Row<TableData>, columnId: string, filterValue: DateRange) => {
		const date = row.getValue(columnId) as Date;
		const {from, to} = filterValue;

		if (!from) return false;

		if (from && !to) return date >= from;

		if (from && to) return date >= from && date <= to;

		return true; // unused, important parts above
	}
};
