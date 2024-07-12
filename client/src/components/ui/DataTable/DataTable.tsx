import {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table as TanstackTable,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {userFilterFns} from '@/utils/columns';
import {Flex} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useEffect} from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	paginationState?: [PaginationState, Dispatch<SetStateAction<PaginationState>>];
	globalFilterState?: [string, Dispatch<SetStateAction<string>>];
	filterState?: [ColumnFiltersState, Dispatch<SetStateAction<ColumnFiltersState>>];
	sortingState?: [SortingState, Dispatch<SetStateAction<SortingState>>];
	rowSelectionState?: [RowSelectionState, Dispatch<SetStateAction<RowSelectionState>>];
	handleInitTable?: (table: TanstackTable<TData>) => void;
	handleRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	paginationState,
	filterState,
	sortingState,
	globalFilterState,
	rowSelectionState,
	handleInitTable,
	handleRowClick
}: DataTableProps<TData, TValue>) {
	const [filters, setFilters] = filterState || [[], () => []];
	const [sorts, setSorts] = sortingState || [[], () => []];
	const [pagination, setPagination] = paginationState || [undefined, () => undefined];
	const [rowSelection, setRowSelection] = rowSelectionState || [undefined, () => undefined];
	const [globalFilter, setGlobalFilter] = globalFilterState || [[], () => []];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...(pagination && {
			getPaginationRowModel: getPaginationRowModel(),
			onPaginationChange: setPagination
		}),
		state: {
			...(pagination && {pagination}),
			...(globalFilter && {globalFilter: globalFilter}),
			...(filterState && {columnFilters: filters}),
			...(sortingState && {sorting: sorts}),
			...(rowSelection && {rowSelection})
		},
		...(filterState && {
			onColumnFiltersChange: setFilters,
			getFilteredRowModel: getFilteredRowModel()
		}),
		filterFns: {
			withinDateRange: userFilterFns.withinDateRange
		},
		...(sortingState && {
			onSortingChange: setSorts,
			getSortedRowModel: getSortedRowModel()
		}),
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: (row, columnId, filterValue) => {
			let value;
			if (filterValue.toString) {
				// number
				value = (row.getValue(columnId) as number).toString();
			} else {
				value = row.getValue(columnId) as string;
			}

			const isRelevant = value?.toLowerCase().includes(filterValue.toLowerCase().trim());

			return isRelevant;
		},
		onRowSelectionChange: setRowSelection
	});

	useEffect(() => {
		handleInitTable && handleInitTable(table);
	}, []);

	return (
		<Flex flex={1} className='rounded-md border'>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, i) => {
							if (i == table.getRowModel().rows?.length - 1) {
								return (
									<TableRow
										id={'last-row'}
										key={row.id}
										onClick={() => {
											handleRowClick && handleRowClick(row.original);
										}}
										data-state={row.getIsSelected() && 'selected'}
										style={{cursor: 'pointer'}}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												onClick={(e) => {
													if (
														e.currentTarget.childNodes[0].firstChild?.firstChild?.nodeName.toLowerCase() ==
														'input'
													) {
														e.stopPropagation();
													}
												}}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								);
							}
							return (
								<TableRow
									key={row.id}
									onClick={() => {
										handleRowClick && handleRowClick(row.original);
									}}
									data-state={row.getIsSelected() && 'selected'}
									style={{cursor: 'pointer'}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											onClick={(e) => {
												// If click on table row checkbox
												if (
													e.currentTarget.childNodes[0].firstChild?.firstChild?.nodeName.toLowerCase() ==
													'input'
												) {
													e.stopPropagation();
												}
											}}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Flex>
	);
}
