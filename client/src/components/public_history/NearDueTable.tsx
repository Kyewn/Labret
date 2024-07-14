import {NearDueTableFilters} from '@/components/public_history/NearDueTableFilters';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getPublicHistoryActiveRecordColumns} from '@/utils/columns';
import {
	useInitialPublicHistoryTableContext,
	usePublicHistoryTableContext
} from '@/utils/context/PublicHistoryTableContext';
import {RentalRecord} from '@/utils/data';
import {Button, ButtonGroup} from '@chakra-ui/react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const NearDueTable = () => {
	const userHistoryTableContext = usePublicHistoryTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,

		handleInitTable,
		nearDueTableState,
		paginationState_nearDueTable,
		rowSelectionState_nearDueTable,
		searchTextState_nearDueTable,
		tableFiltersState_nearDueTable,
		tableSortingState_nearDueTable
	} = userHistoryTableContext as ReturnType<typeof useInitialPublicHistoryTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = nearDueTableState;
	const [pagination] = paginationState_nearDueTable;

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
			<NearDueTableFilters />
			<DataTable
				columns={getPublicHistoryActiveRecordColumns()}
				data={tableData || []}
				paginationState={paginationState_nearDueTable}
				rowSelectionState={rowSelectionState_nearDueTable}
				globalFilterState={searchTextState_nearDueTable}
				filterState={tableFiltersState_nearDueTable}
				sortingState={tableSortingState_nearDueTable}
				handleInitTable={(table) => handleInitTable(1, table)}
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
