import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	Table as TanstackTable,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {userFilterFns} from '@/utils/dataType';
import {Flex} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useEffect} from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	handleInitTable?: (table: TanstackTable<TData>) => void;
	globalFilterState?: [string, Dispatch<SetStateAction<string>>];
	filterState?: [ColumnFiltersState, Dispatch<SetStateAction<ColumnFiltersState>>];
	sortingState?: [SortingState, Dispatch<SetStateAction<SortingState>>];
	handleRowClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	filterState,
	sortingState,
	globalFilterState,
	handleInitTable,
	handleRowClick
}: DataTableProps<TData, TValue>) {
	const [filters, setFilters] = filterState || [[], () => []];
	const [sorts, setSorts] = sortingState || [[], () => []];
	const [globalFilter, setGlobalFilter] = globalFilterState || [[], () => []];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		...(filterState && {
			onColumnFiltersChange: setFilters,
			getFilteredRowModel: getFilteredRowModel()
		}),
		...(sortingState && {
			onSortingChange: setSorts,
			getSortedRowModel: getSortedRowModel()
		}),
		onGlobalFilterChange: setGlobalFilter,
		state: {
			...(globalFilter && {globalFilter: globalFilter}),
			...(filterState && {columnFilters: filters}),
			...(sortingState && {sorting: sorts})
		},
		filterFns: {
			withinUserDateRange: userFilterFns.withinUserDateRange
		},
		globalFilterFn: (row, columnId, filterValue) => {
			const value = row.getValue(columnId) as string;
			const intValue = (row.getValue(columnId) as number).toString();

			const isRelevant =
				value.toLowerCase().includes(filterValue.toLowerCase().trim()) ||
				intValue.toLowerCase().includes(filterValue.toLowerCase().trim());

			return isRelevant;
		}
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
										onClick={() => handleRowClick && handleRowClick(row.original)}
										data-state={row.getIsSelected() && 'selected'}
										style={{cursor: 'pointer'}}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								);
							}
							return (
								<TableRow
									key={row.id}
									onClick={() => handleRowClick && handleRowClick(row.original)}
									data-state={row.getIsSelected() && 'selected'}
									style={{cursor: 'pointer'}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
