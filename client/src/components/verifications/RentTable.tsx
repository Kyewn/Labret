import {DataTable} from '@/components/ui/DataTable/DataTable';
import {RecordRejected} from '@/components/ui/EmailComponents/RecordRejected';
import {RecordVerified} from '@/components/ui/EmailComponents/RecordVerified';
import {RentVerificationFilters} from '@/components/verifications/RentVerificationsFilters';
import {getRentVerificationColumns} from '@/utils/columns';
import {
	useInitialVerificationTableContext,
	useVerificationTableContext
} from '@/utils/context/VerificationTableContext';
import {RentalRecord, User, Verification} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {render} from '@react-email/components';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const RentTable = () => {
	const verificationTableContext = useVerificationTableContext();

	const {
		tableData,
		selectedDataState,
		infoDisclosure,
		selectionDisclosure,

		handleInitTable,
		rentTableState,
		paginationState_rentTable,
		rowSelectionState_rentTable,
		searchTextState_rentTable,
		tableFiltersState_rentTable,
		tableSortingState_rentTable,

		handleVerifyRent,
		handleVerifyRentForRows,
		handleRejectRent,
		handleRejectRentForRows
	} = verificationTableContext as ReturnType<typeof useInitialVerificationTableContext>;
	const [, setSelectedData] = selectedDataState;
	const [table] = rentTableState;
	const [pagination] = paginationState_rentTable;
	const [rowSelection] = rowSelectionState_rentTable;

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

	// For verify/reject executed by UI (clicks)
	const handleSendEmail = async (
		emailType: 'verifyRent' | 'rejectRent',
		verification: Verification,
		verifiedBy: string,
		verifiedAt: string
	) => {
		// Send notification email to user
		const recordName = (verification.record as RentalRecord).recordTitle;
		const email = ((verification.record as RentalRecord).renter as User).email;

		if (emailType == 'verifyRent') {
			const emailHtml = await render(
				<RecordVerified
					recordType='rent'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending rent verified',
					email,
					html: emailHtml
				})
			});
		} else {
			const emailHtml = await render(
				<RecordRejected
					recordType='rent'
					recordName={recordName}
					authorName={verifiedBy}
					createdAt={verifiedAt}
				/>
			);
			await fetch('http://localhost:8002/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					subject: 'Pending rent rejected',
					email,
					html: emailHtml
				})
			});
		}
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
			<RentVerificationFilters />
			<DataTable
				columns={getRentVerificationColumns(
					onOpen,
					onClose,
					handleVerifyRent,
					handleRejectRent,
					handleSendEmail
				)}
				data={tableData || []}
				paginationState={paginationState_rentTable}
				rowSelectionState={rowSelectionState_rentTable}
				globalFilterState={searchTextState_rentTable}
				filterState={tableFiltersState_rentTable}
				sortingState={tableSortingState_rentTable}
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
									const verifiedAt = new Date().toISOString();
									handleVerifyRentForRows(selectedVerifications, verifiedAt, handleSendEmail);
								}}
							>
								Verify
							</Button>
							<Button
								variant={'outline'}
								onClick={() => {
									const selectedVerifications = Object.keys(rowSelection).map((key) => {
										const verification = table?.getRow(key).original;
										return verification as Verification;
									});
									const verifiedAt = new Date().toISOString();

									handleRejectRentForRows(selectedVerifications, verifiedAt, handleSendEmail);
								}}
							>
								Reject
							</Button>
						</ButtonGroup>
					</Flex>
				</HStack>
			</Slide>
		</>
	);
};
