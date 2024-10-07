import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {editRecord} from '@/db/record';
import {editVerification, getAllVerifications} from '@/db/verification';
import {useAppContext} from '@/utils/context/AppContext';
import {EditVerificationFormValues, RentalRecord, User, Verification} from '@/utils/data';
import {useDisclosure, useToast} from '@chakra-ui/react';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {createContext, SyntheticEvent, useContext, useState} from 'react';
import {useForm} from 'react-hook-form';

// TABLE STRUCTURES
export const useInitialVerificationTableContext = () => {
	// Table data states
	const {
		appState: {user}
	} = useAppContext();
	const tabState = useState<number>(0);
	const initDataState = useState<Verification[] | undefined>(undefined);
	const tableDataState = useState<Verification[] | undefined>(undefined);
	const selectedDataState = useState<Verification | undefined>(undefined);
	const rejectFormState = useForm<EditVerificationFormValues>();
	const {watch, reset} = rejectFormState;

	const toast = useToast();
	const infoDisclosure = useDisclosure(); // Item modal
	const selectionDisclosure = useDisclosure(); // Selection actions modal
	const confirmDialogDisclosure = useDisclosure();
	const verificationRejectConfirmDialogDisclosure = useDisclosure();
	const confirmDialogState = useState<Omit<ConfirmDialogProps, 'disclosure'>>({
		title: 'Are you sure?',
		description: '',
		onConfirm: () => {}
	});
	const [initData, setInitData] = initDataState;
	const [tableData, setTableData] = tableDataState;
	const {onClose} = selectionDisclosure;
	const {onClose: onInfoClose} = infoDisclosure;
	const [, setConfirmDialog] = confirmDialogState;
	const [tab] = tabState;

	// Separate states for each table
	const rentTableState = useState<Table<Verification> | undefined>(undefined);
	const searchTextState_rentTable = useState('');
	const initialFilterValueState_rentTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_rentTable] = initialFilterValueState_rentTable;
	const tableFiltersState_rentTable = useState<ColumnFiltersState>(initialFilterValue_rentTable);
	const initialSortingState_rentTable: SortingState = [{id: 'createdAt', desc: true}];
	const tableSortingState_rentTable = useState<SortingState>(initialSortingState_rentTable);
	const paginationState_rentTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_rentTable = useState<RowSelectionState>({});

	const returnTableState = useState<Table<Verification> | undefined>(undefined);
	const searchTextState_returnTable = useState('');
	const initialFilterValueState_returnTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_returnTable] = initialFilterValueState_returnTable;
	const tableFiltersState_returnTable = useState<ColumnFiltersState>(
		initialFilterValue_returnTable
	);
	const initialSortingState_returnTable = [{id: 'createdAt', desc: true}];
	const tableSortingState_returnTable = useState<SortingState>(initialSortingState_returnTable);
	const paginationState_returnTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_returnTable = useState<RowSelectionState>({});

	const [, setRentTable] = rentTableState;
	const [, setReturnTable] = returnTableState;

	const handleInitTable = (tableIdx: number, table: Table<Verification>) => {
		switch (tableIdx) {
			case 0:
				setRentTable(table);
				break;
			case 1:
				setReturnTable(table);
				break;
		}
	};
	const refetch = async () => {
		const verifications = await getAllVerifications();

		setInitData(() => {
			switch (tab) {
				case 0: {
					const tableData = verifications.filter(
						(verification) =>
							(verification.record as RentalRecord).recordStatus == 'pending' ||
							(verification.record as RentalRecord).recordStatus == 'rent_reverifying'
					);
					setTableData(tableData);
					break;
				}
				case 1: {
					const tableData = verifications.filter(
						(verification) =>
							(verification.record as RentalRecord).recordStatus == 'returning' ||
							(verification.record as RentalRecord).recordStatus == 'return_reverifying'
					);
					setTableData(tableData);
					break;
				}
			}
			return verifications;
		});
	};

	const handleVerifyRent = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();
		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleVerify = async () => {
			try {
				// TODO: Send general (reject or delete) email to user notifying verify
				await editRecord((record as RentalRecord).recordId, {recordStatus: 'active'});
				await editVerification(verification.verificationId, {
					verifiedBy: (user as User).id,
					verifiedAt: new Date().toISOString()
				});
				// Clear row selections
				rentTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record verified',
					description: `Record of ${name} have been verified.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to verify record',
					description: `Record of ${name} could not be verified, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to verify this record?`,
				onConfirm: handleVerify
			};
		});
	};

	const handleRejectRent = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();
		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		verificationRejectConfirmDialogDisclosure.onOpen();

		const handleReject = async () => {
			const {verificationComments, isRecordSerious} = watch();
			try {
				// TODO: Send general (reject or delete) email to user notifying verify
				await editRecord((record as RentalRecord).recordId, {recordStatus: 'rent_rejected'});
				await editVerification(verification.verificationId, {
					verificationComments: verificationComments?.length ? verificationComments : '',
					isRecordSerious: isRecordSerious ? true : false,
					verifiedBy: (user as User).id,
					verifiedAt: new Date().toISOString()
				});
				// Clear row selections
				rentTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record rejected',
					description: `Record of ${name} have been rejected.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to reject record',
					description: `Record of ${name} could not be rejected, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
			// reset reject form values after each reject
			reset();
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject this record?`,
				onConfirm: handleReject
			};
		});
	};

	const handleVerifyReturn = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();
		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleVerify = async () => {
			try {
				// TODO: Send general (reject or delete) email to user notifying verify
				await editRecord((record as RentalRecord).recordId, {
					recordStatus: 'completed',
					returnedAt: new Date().toISOString()
				});
				await editVerification(verification.verificationId, {
					verifiedBy: (user as User).id,
					verifiedAt: new Date().toISOString()
				});
				// Clear row selections
				returnTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record verified',
					description: `Record of ${name} have been verified.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to verify record',
					description: `Record of ${name} could not be verified, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to verify this record?`,
				onConfirm: handleVerify
			};
		});
	};

	const handleRejectReturn = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();
		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		verificationRejectConfirmDialogDisclosure.onOpen();

		const handleReject = async () => {
			const {verificationComments, isRecordSerious} = watch();
			try {
				// TODO: Send general (reject or delete) email to user notifying verify
				await editRecord((record as RentalRecord).recordId, {recordStatus: 'return_rejected'});
				await editVerification(verification.verificationId, {
					verificationComments: verificationComments?.length ? verificationComments : '',
					isRecordSerious: isRecordSerious ? true : false,
					verifiedBy: (user as User).id,
					verifiedAt: new Date().toISOString()
				});
				// Clear row selections
				returnTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record rejected',
					description: `Record of ${name} have been rejected.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to reject record',
					description: `Record of ${name} could not be rejected, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
			// reset reject form values after each reject
			reset();
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject this record?`,
				onConfirm: handleReject
			};
		});
	};

	const handleVerifyRentForRows = async (verifications: Verification[]) => {
		confirmDialogDisclosure.onOpen();

		const handleVerify = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;
					// TODO: Send general (reject or delete) email to user notifying verify
					await editRecord((record as RentalRecord).recordId, {recordStatus: 'active'});
					await editVerification(verification.verificationId, {
						verifiedBy: (user as User).id,
						verifiedAt: new Date().toISOString()
					});
				}

				// Clear row selections
				rentTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Records verified',
					description: `Selected records have been verified.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to verify records',
					description: `Selected records could not be verified, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to verify all selected records?`,
				onConfirm: handleVerify
			};
		});
	};

	const handleVerifyReturnForRows = async (verifications: Verification[]) => {
		// TODO
		confirmDialogDisclosure.onOpen();

		const handleVerify = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;
					await editRecord((record as RentalRecord).recordId, {
						recordStatus: 'completed',
						returnedAt: new Date().toISOString()
					});
					await editVerification(verification.verificationId, {
						verifiedBy: (user as User).id,
						verifiedAt: new Date().toISOString()
					});
				}

				// Clear row selections
				returnTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Records verified',
					description: `Selected records have been verified.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to verify records',
					description: `Selected records could not be verified, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to verify all selected records?`,
				onConfirm: handleVerify
			};
		});
	};

	const handleRejectRentForRows = async (verifications: Verification[]) => {
		verificationRejectConfirmDialogDisclosure.onOpen();

		const handleReject = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;

					const {verificationComments, isRecordSerious} = watch();
					// TODO: Send general (reject or delete) email to user notifying verify
					await editRecord((record as RentalRecord).recordId, {recordStatus: 'rent_rejected'});
					await editVerification(verification.verificationId, {
						verificationComments: verificationComments?.length ? verificationComments : '',
						isRecordSerious: isRecordSerious ? true : false,
						verifiedBy: (user as User).id,
						verifiedAt: new Date().toISOString()
					});
				}
				// Clear row selections
				returnTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)

				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record rejected',
					description: `All selected rent records have been set to rejected.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to reject record',
					description: `Some selected rent records could not be set to rejected, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
			// reset reject form values after each reject
			reset();
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject these record(s)?`,
				onConfirm: handleReject
			};
		});
	};

	const handleRejectReturnForRows = async (verifications: Verification[]) => {
		verificationRejectConfirmDialogDisclosure.onOpen();

		const handleReject = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;

					const {verificationComments, isRecordSerious} = watch();
					// TODO: Send general (reject or delete) email to user notifying verify
					await editRecord((record as RentalRecord).recordId, {recordStatus: 'return_rejected'});
					await editVerification(verification.verificationId, {
						verificationComments: verificationComments?.length ? verificationComments : '',
						isRecordSerious: isRecordSerious ? true : false,
						verifiedBy: (user as User).id,
						verifiedAt: new Date().toISOString()
					});
				}
				// Clear row selections
				returnTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)

				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record rejected',
					description: `All selected return records have been set to rejected.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to reject record',
					description: `Some selected return records could not be set to rejected, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
			// reset reject form values after each reject
			reset();
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject these record(s)?`,
				onConfirm: handleReject
			};
		});
	};

	return {
		// DATA
		initData,
		tableData,
		initDataState,
		tableDataState,
		selectedDataState,
		tabState,
		infoDisclosure,
		selectionDisclosure,
		confirmDialogState,
		confirmDialogDisclosure,
		verificationRejectConfirmDialogDisclosure,
		rejectFormState,

		// FILTERS
		rentTableState,
		initialFilterValueState_rentTable,
		initialSortingState_rentTable,
		searchTextState_rentTable, // Global filter search
		tableFiltersState_rentTable,
		tableSortingState_rentTable,
		paginationState_rentTable,
		rowSelectionState_rentTable,

		returnTableState,
		initialFilterValueState_returnTable,
		initialSortingState_returnTable,
		searchTextState_returnTable, // Global filter search
		tableFiltersState_returnTable,
		tableSortingState_returnTable,
		paginationState_returnTable,
		rowSelectionState_returnTable,

		handleInitTable,
		refetch,

		// ACTIONS
		handleVerifyRent,
		handleRejectRent,
		handleVerifyReturn,
		handleRejectReturn,
		handleVerifyRentForRows,
		handleVerifyReturnForRows,
		handleRejectRentForRows,
		handleRejectReturnForRows
	};
};

export const VerificationTableContext = createContext<
	ReturnType<typeof useInitialVerificationTableContext> | undefined
>(undefined);

export const useVerificationTableContext = () => useContext(VerificationTableContext);
