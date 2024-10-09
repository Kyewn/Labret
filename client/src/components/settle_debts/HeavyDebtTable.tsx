import {HeavyDebtTableFilters} from '@/components/settle_debts/HeavyDebtTableFilters.tsx';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {RecordPaid} from '@/components/ui/EmailComponents/RecordPaid';
import {getHeavyDebtColumns} from '@/utils/columns';
import {useDebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {RentalRecord, User, Verification} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {render} from '@react-email/components';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const HeavyDebtTable = () => {
	const debtTableContext = useDebtTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,
		selectionDisclosure,

		handleInitTable,
		heavyDebtTableState,
		paginationState_heavyDebtTable,
		rowSelectionState_heavyDebtTable,
		searchTextState_heavyDebtTable,
		tableFiltersState_heavyDebtTable,
		tableSortingState_heavyDebtTable,

		handleSetAsPaidHeavy,
		handleSetAsPaidForRowsHeavy,
		handleSetAsNormal,
		handleSetAsNormalForRows
	} = debtTableContext as ReturnType<typeof useInitialDebtTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = heavyDebtTableState;
	const [pagination] = paginationState_heavyDebtTable;
	const [rowSelection] = rowSelectionState_heavyDebtTable;

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

	const handleSendEmail = async (
		verification: Verification,
		verifiedBy: string,
		verifiedAt: string
	) => {
		// Send notification email to user
		const recordName = (verification.record as RentalRecord).recordTitle;
		const email = ((verification.record as RentalRecord).renter as User).email;

		const emailHtml = await render(
			<RecordPaid recordName={recordName} authorName={verifiedBy} createdAt={verifiedAt} />
		);
		await fetch('http://localhost:8002/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				subject: 'Record set to Paid',
				email,
				html: emailHtml
			})
		});
	};

	return (
		<>
			<HeavyDebtTableFilters />
			<DataTable
				columns={getHeavyDebtColumns(
					onOpen,
					onClose,
					handleSetAsPaidHeavy,
					handleSetAsNormal,
					handleSendEmail
				)}
				data={tableData || []}
				paginationState={paginationState_heavyDebtTable}
				rowSelectionState={rowSelectionState_heavyDebtTable}
				globalFilterState={searchTextState_heavyDebtTable}
				filterState={tableFiltersState_heavyDebtTable}
				sortingState={tableSortingState_heavyDebtTable}
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
						<ButtonGroup>
							<Button
								onClick={() => {
									const selectedVerifications = Object.keys(rowSelection).map((key) => {
										const verification = table?.getRow(key).original;
										return verification as Verification;
									});
									const verifiedAt = new Date().toISOString();

									handleSetAsPaidForRowsHeavy(selectedVerifications, verifiedAt, handleSendEmail);
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
									handleSetAsNormalForRows(selectedVerifications);
								}}
							>
								Change to Normal
							</Button>
						</ButtonGroup>
					</Flex>
				</HStack>
			</Slide>
		</>
	);
};
