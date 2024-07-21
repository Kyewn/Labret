import {NormalDebtTableFilters} from '@/components/settle_debts/NormalDebtTableFilters';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getNormalDebtColumns} from '@/utils/columns';
import {useDebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {Verification} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const NormalDebtTable = () => {
	const debtTableContext = useDebtTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,
		selectionDisclosure,

		handleInitTable,
		normalDebtTableState,
		paginationState_normalDebtTable,
		rowSelectionState_normalDebtTable,
		searchTextState_normalDebtTable,
		tableFiltersState_normalDebtTable,
		tableSortingState_normalDebtTable,

		handleSetAsPaidNormal,
		handleSetAsPaidForRowsNormal,
		handleSetAsHeavy,
		handleSetAsHeavyForRows
	} = debtTableContext as ReturnType<typeof useInitialDebtTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = normalDebtTableState;
	const [pagination] = paginationState_normalDebtTable;
	const [rowSelection] = rowSelectionState_normalDebtTable;

	const {onOpen: onInfoOpen} = infoDisclosure;
	const {isOpen, onOpen, onClose} = selectionDisclosure; // Selection actions modal
	const [canNext, setCanNext] = useState(false);
	const [canPrev, setCanPrev] = useState(false);

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => pagination && pagination.pageIndex, [pagination]);

	const handleRowClick = (data: Verification) => {
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
			<NormalDebtTableFilters />
			<DataTable
				columns={getNormalDebtColumns(onOpen, onClose, handleSetAsPaidNormal, handleSetAsHeavy)}
				data={tableData || []}
				paginationState={paginationState_normalDebtTable}
				rowSelectionState={rowSelectionState_normalDebtTable}
				globalFilterState={searchTextState_normalDebtTable}
				filterState={tableFiltersState_normalDebtTable}
				sortingState={tableSortingState_normalDebtTable}
				handleInitTable={(table) => handleInitTable(0, table)}
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
						<ButtonGroup>
							<Button
								onClick={() => {
									const selectedVerifications = Object.keys(rowSelection).map((key) => {
										const verification = table?.getRow(key).original;
										return verification as Verification;
									});
									handleSetAsPaidForRowsNormal(selectedVerifications);
								}}
							>
								Set As Paid
							</Button>
							<Button
								onClick={() => {
									const selectedVerifications = Object.keys(rowSelection).map((key) => {
										const verification = table?.getRow(key).original;
										return verification as Verification;
									});
									handleSetAsHeavyForRows(selectedVerifications);
								}}
							>
								Change to Heavy
							</Button>
						</ButtonGroup>
					</Flex>
				</HStack>
			</Slide>
		</>
	);
};
