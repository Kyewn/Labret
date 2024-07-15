import {AvailabilityTableFilters} from '@/components/item_availability/AvailabilityTableFilters';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getItemAvailabilityTableColumns} from '@/utils/columns';
import {
	useInitialItemAvailabilityTableContext,
	useItemAvailabilityTableContext
} from '@/utils/context/ItemAvailabilityTableContext';
import {Item} from '@/utils/data';
import {Button, ButtonGroup} from '@chakra-ui/react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const AvailabilityTable = () => {
	const availabilityTableTableContext = useItemAvailabilityTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,

		handleInitTable,
		availabilityTableState,
		paginationState_availabilityTable,
		rowSelectionState_availabilityTable,
		searchTextState_availabilityTable,
		tableFiltersState_availabilityTable,
		tableSortingState_availabilityTable
	} = availabilityTableTableContext as ReturnType<typeof useInitialItemAvailabilityTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [availabilityTable] = availabilityTableState;
	const [pagination] = paginationState_availabilityTable;

	const {onOpen: onInfoOpen} = infoDisclosure;
	const [canNext, setCanNext] = useState(false);
	const [canPrev, setCanPrev] = useState(false);

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => pagination && pagination.pageIndex, [pagination]);

	const handleRowClick = (data: Item) => {
		setSelectedData(data);
		onInfoOpen();
	};

	// Update pagination state as they change
	useEffect(() => {
		setCanNext(availabilityTable?.getCanNextPage() || false);
		setCanPrev(availabilityTable?.getCanPreviousPage() || false);
	}, [pagination]);

	useEffect(() => {
		pageBottomRef.current?.scrollIntoView({behavior: 'instant'});
	}, [pageIndex]);

	return (
		<>
			<AvailabilityTableFilters />
			<DataTable
				columns={getItemAvailabilityTableColumns()}
				data={tableData || []}
				paginationState={paginationState_availabilityTable}
				rowSelectionState={rowSelectionState_availabilityTable}
				globalFilterState={searchTextState_availabilityTable}
				filterState={tableFiltersState_availabilityTable}
				sortingState={tableSortingState_availabilityTable}
				handleInitTable={(table) => handleInitTable(table)}
				handleRowClick={handleRowClick}
			/>
			<ButtonGroup ref={pageBottomRef} marginY={3} width={'100%'} justifyContent={'flex-end'}>
				<Button
					variant={'outline'}
					onClick={() => {
						availabilityTable?.firstPage();
					}}
					isDisabled={!canPrev}
				>
					First
				</Button>
				<Button
					onClick={() => {
						availabilityTable?.previousPage();
					}}
					isDisabled={!canPrev}
				>
					Previous
				</Button>
				<Button
					onClick={() => {
						availabilityTable?.nextPage();
					}}
					isDisabled={!canNext}
				>
					Next
				</Button>
				<Button
					variant={'outline'}
					onClick={() => {
						availabilityTable?.lastPage();
					}}
					isDisabled={!canNext}
				>
					Last
				</Button>
			</ButtonGroup>
		</>
	);
};
