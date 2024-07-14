import {CompletedTableFilters} from '@/components/public_history/CompletedTableFilters';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getPublicHistoryCompletedRecordColumns} from '@/utils/columns';
import {
	useInitialPublicHistoryTableContext,
	usePublicHistoryTableContext
} from '@/utils/context/PublicHistoryTableContext';
import {RentalRecord} from '@/utils/data';
import {Button, ButtonGroup} from '@chakra-ui/react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const CompletedTable = () => {
	const userHistoryTableContext = usePublicHistoryTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,

		handleInitTable,
		completedTableState,
		paginationState_completedTable,
		rowSelectionState_completedTable,
		searchTextState_completedTable,
		tableFiltersState_completedTable,
		tableSortingState_completedTable
	} = userHistoryTableContext as ReturnType<typeof useInitialPublicHistoryTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = completedTableState;
	const [pagination] = paginationState_completedTable;

	const {onOpen: onInfoOpen} = infoDisclosure;
	const [canNext, setCanNext] = useState(false);
	const [canPrev, setCanPrev] = useState(false);

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => pagination && pagination.pageIndex, [pagination]);

	const handleRowClick = (data: RentalRecord) => {
		setSelectedData(data);
		onInfoOpen();
	};

	// Update pagination state as they change
	useEffect(() => {
		setCanNext(table?.getCanNextPage() || false);
		setCanPrev(table?.getCanPreviousPage() || false);
	}, [pagination]);

	useEffect(() => {
		pageBottomRef.current?.scrollIntoView({behavior: 'instant'});
	}, [pageIndex]);

	return (
		<>
			<CompletedTableFilters />
			<DataTable
				columns={getPublicHistoryCompletedRecordColumns()}
				data={tableData || []}
				paginationState={paginationState_completedTable}
				rowSelectionState={rowSelectionState_completedTable}
				globalFilterState={searchTextState_completedTable}
				filterState={tableFiltersState_completedTable}
				sortingState={tableSortingState_completedTable}
				handleInitTable={(table) => handleInitTable(2, table)}
				handleRowClick={handleRowClick}
			/>
			<ButtonGroup ref={pageBottomRef} marginY={3} width={'100%'} justifyContent={'flex-end'}>
				<Button
					variant={'outline'}
					onClick={() => {
						table?.firstPage();
					}}
					isDisabled={!canPrev}
				>
					First
				</Button>
				<Button
					onClick={() => {
						table?.previousPage();
					}}
					isDisabled={!canPrev}
				>
					Previous
				</Button>
				<Button
					onClick={() => {
						table?.nextPage();
					}}
					isDisabled={!canNext}
				>
					Next
				</Button>
				<Button
					variant={'outline'}
					onClick={() => {
						table?.lastPage();
					}}
					isDisabled={!canNext}
				>
					Last
				</Button>
			</ButtonGroup>
		</>
	);
};
