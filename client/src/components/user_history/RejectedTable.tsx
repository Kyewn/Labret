import {DataTable} from '@/components/ui/DataTable/DataTable';
import {UserHistoryRejectedFilters} from '@/components/user_history/UserHistoryRejectedFilters';
import {getUserHistoryActiveRecordColumns} from '@/utils/columns';
import {
	useInitialUserHistoryTableContext,
	useUserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
import {RentalRecord} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const RejectedTable = () => {
	const userHistoryTableContext = useUserHistoryTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,

		handleInitTable,
		rejectedTableState,
		paginationState_rejectedTable,
		rowSelectionState_rejectedTable,
		searchTextState_rejectedTable,
		tableFiltersState_rejectedTable,
		tableSortingState_rejectedTable,

		selectionDisclosure
	} = userHistoryTableContext as ReturnType<typeof useInitialUserHistoryTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = rejectedTableState;
	const [pagination] = paginationState_rejectedTable;
	const [rowSelection] = rowSelectionState_rejectedTable;

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
			<UserHistoryRejectedFilters />
			<DataTable
				columns={getUserHistoryActiveRecordColumns()}
				data={tableData || []}
				paginationState={paginationState_rejectedTable}
				rowSelectionState={rowSelectionState_rejectedTable}
				globalFilterState={searchTextState_rejectedTable}
				filterState={tableFiltersState_rejectedTable}
				sortingState={tableSortingState_rejectedTable}
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
