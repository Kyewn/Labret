import {DataTable} from '@/components/ui/DataTable/DataTable';
import {UserHistoryCompletedFilters} from '@/components/user_history/UserHistoryCompletedFilters';
import {getUserHistoryCompletedRecordColumns} from '@/utils/columns';
import {
	useInitialUserHistoryTableContext,
	useUserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
import {RentalRecord} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const CompletedTable = () => {
	const userHistoryTableContext = useUserHistoryTableContext();

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
		tableSortingState_completedTable,

		selectionDisclosure
	} = userHistoryTableContext as ReturnType<typeof useInitialUserHistoryTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = completedTableState;
	const [pagination] = paginationState_completedTable;
	const [rowSelection] = rowSelectionState_completedTable;

	const {onOpen: onInfoOpen} = infoDisclosure;
	const {isOpen, onOpen, onClose} = selectionDisclosure; // Selection actions modal
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
			<UserHistoryCompletedFilters />
			<DataTable
				columns={getUserHistoryCompletedRecordColumns()}
				data={tableData || []}
				paginationState={paginationState_completedTable}
				rowSelectionState={rowSelectionState_completedTable}
				globalFilterState={searchTextState_completedTable}
				filterState={tableFiltersState_completedTable}
				sortingState={tableSortingState_completedTable}
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

			{/* Selection controls */}
			{rowSelection && !!Object.entries(rowSelection).length && (
				<Button
					position={'fixed'}
					bottom={10}
					left={0}
					right={0}
					w={'20rem'}
					margin={'auto'}
					leftIcon={<SquareCheck />}
					onClick={onOpen}
				>
					Selection Actions
				</Button>
			)}

			<Slide direction='bottom' in={isOpen}>
				<HStack
					flexDirection={'column'}
					p={5}
					paddingTop={2}
					backgroundColor={'var(--chakra-colors-chakra-body-bg)'}
					boxShadow={'0 0 9px 0 var(--chakra-colors-gray-400)'}
				>
					<IconButton
						width={'20rem'}
						aria-label={'toggle-selection-actions'}
						variant={'iconButton'}
						icon={<ChevronDown />}
						onClick={onClose}
					/>
					<Flex w={'100%'} alignItems={'center'}>
						<Text>
							{Object.entries(rowSelection || {}).length} of {tableData?.length} record(s) selected
						</Text>
						<Spacer />
						<></>
					</Flex>
				</HStack>
			</Slide>
		</>
	);
};
