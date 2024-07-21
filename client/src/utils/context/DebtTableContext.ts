import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {editRecord} from '@/db/record';
import {editVerification} from '@/db/verification';
import {RentalRecord, User, Verification} from '@/utils/data';
import {useDisclosure, useToast} from '@chakra-ui/react';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {createContext, SyntheticEvent, useContext, useState} from 'react';

// TABLE STRUCTURES
export const useInitialDebtTableContext = () => {
	// Table data states
	const tabState = useState<number>(0);
	const initDataState = useState<Verification[] | undefined>(undefined);
	const tableDataState = useState<Verification[] | undefined>(undefined);
	const selectedDataState = useState<Verification | undefined>(undefined);

	const toast = useToast();
	const infoDisclosure = useDisclosure(); // Item modal
	const selectionDisclosure = useDisclosure(); // Selection actions modal
	const confirmDialogDisclosure = useDisclosure();
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
	const normalDebtTableState = useState<Table<Verification> | undefined>(undefined);
	const searchTextState_normalDebtTable = useState('');
	const initialFilterValueState_normalDebtTable = useState<ColumnFiltersState>([]);
	const initialFilterValueState_normalDebtSummaryTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_normalDebtTable] = initialFilterValueState_normalDebtTable;
	const [initialFilterValue_normalDebtSummaryTable] =
		initialFilterValueState_normalDebtSummaryTable;
	const tableFiltersState_normalDebtTable = useState<ColumnFiltersState>(
		initialFilterValue_normalDebtTable
	);
	const tableFiltersState_normalDebtSummaryTable = useState<ColumnFiltersState>(
		initialFilterValue_normalDebtSummaryTable
	);
	const initialSortingState_normalDebtTable: SortingState = [{id: 'createdAt', desc: true}];
	const initialSortingState_normalDebtSummaryTable: SortingState = [];
	const tableSortingState_normalDebtTable = useState<SortingState>(
		initialSortingState_normalDebtTable
	);
	const tableSortingState_normalDebtSummaryTable = useState<SortingState>([]);
	const paginationState_normalDebtTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_normalDebtTable = useState<RowSelectionState>({});

	const heavyDebtTableState = useState<Table<Verification> | undefined>(undefined);
	const searchTextState_heavyDebtTable = useState('');
	const initialFilterValueState_heavyDebtTable = useState<ColumnFiltersState>([]);
	const initialFilterValueState_heavyDebtSummaryTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_heavyDebtTable] = initialFilterValueState_heavyDebtTable;
	const [initialFilterValue_heavyDebtSummaryTable] = initialFilterValueState_heavyDebtSummaryTable;
	const tableFiltersState_heavyDebtTable = useState<ColumnFiltersState>(
		initialFilterValue_heavyDebtTable
	);
	const tableFiltersState_heavyDebtSummaryTable = useState<ColumnFiltersState>(
		initialFilterValue_heavyDebtSummaryTable
	);
	const initialSortingState_heavyDebtTable = [{id: 'createdAt', desc: true}];
	const initialSortingState_heavyDebtSummaryTable: SortingState = [];

	const tableSortingState_heavyDebtTable = useState<SortingState>(
		initialSortingState_heavyDebtTable
	);
	const tableSortingState_heavyDebtSummaryTable = useState<SortingState>([]);
	const paginationState_heavyDebtTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_heavyDebtTable = useState<RowSelectionState>({});

	const [, setNormalDebtTable] = normalDebtTableState;
	const [, setHeavyDebtTable] = heavyDebtTableState;

	const handleInitTable = (tableIdx: number, table: Table<Verification>) => {
		switch (tableIdx) {
			case 0:
				setNormalDebtTable(table);
				break;
			case 1:
				setHeavyDebtTable(table);
				break;
		}
	};
	const refetch = async () => {
		const verifications = dummyVerifications;

		setInitData(() => {
			switch (tab) {
				case 0: {
					// Normal debt
					const tableData = verifications.filter(
						(verification) =>
							!verification.isRecordSerious &&
							((verification.record as RentalRecord).recordStatus == 'rent_rejected' ||
								(verification.record as RentalRecord).recordStatus == 'return_rejected')
					);
					setTableData(tableData);
					break;
				}
				case 1: {
					// heavy debt
					const tableData = verifications.filter(
						(verification) =>
							verification.isRecordSerious &&
							((verification.record as RentalRecord).recordStatus == 'rent_rejected' ||
								(verification.record as RentalRecord).recordStatus == 'return_rejected')
					);

					setTableData(tableData);
					break;
				}
			}
			return verifications;
		});
	};

	const handleSetAsPaidNormal = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();

		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleSetPaid = async () => {
			try {
				await editRecord((record as RentalRecord).recordId, {
					recordStatus: 'paid',
					returnedAt: new Date()
				});

				// Clear row selections
				normalDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record set as paid',
					description: `Record of ${name} have been set as paid.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set record as paid',
					description: `Record of ${name} could not be set as paid, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set this record as paid?`,
				onConfirm: handleSetPaid
			};
		});
	};

	const handleSetAsPaidHeavy = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();

		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleSetPaid = async () => {
			try {
				await editRecord((record as RentalRecord).recordId, {
					recordStatus: 'paid',
					returnedAt: new Date()
				});

				// Clear row selections
				heavyDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Record set as paid',
					description: `Record of ${name} have been set as paid.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set record as paid',
					description: `Record of ${name} could not be set as paid, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set this record as paid?`,
				onConfirm: handleSetPaid
			};
		});
	};

	const handleSetAsPaidForRowsNormal = async (verifications: Verification[]) => {
		confirmDialogDisclosure.onOpen();

		const handleSetPaid = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;
					await editRecord((record as RentalRecord).recordId, {
						status: 'paid',
						returnedAt: new Date()
					});
				}

				// Clear row selections
				normalDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Records set as paid',
					description: `Selected records have been set as paid.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set records as paid',
					description: `Selected records could not be set as paid, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set all selected records as paid?`,
				onConfirm: handleSetPaid
			};
		});
	};

	const handleSetAsPaidForRowsHeavy = async (verifications: Verification[]) => {
		confirmDialogDisclosure.onOpen();

		const handleSetPaid = async () => {
			try {
				for (const verification of verifications) {
					const {record} = verification;
					await editRecord((record as RentalRecord).recordId, {
						status: 'paid',
						returnedAt: new Date()
					});
				}

				// Clear row selections
				heavyDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Records set as paid',
					description: `Selected records have been set as paid.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set records as paid',
					description: `Selected records could not be set as paid, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set all selected records as paid?`,
				onConfirm: handleSetPaid
			};
		});
	};

	const handleSetAsNormal = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();

		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleSetNormal = async () => {
			try {
				await editVerification(verification.verificationId, {
					isRecordSerious: false
				});

				// Clear row selections
				heavyDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Debt type changed',
					description: `Record of ${name} have been changed to normal debt.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set debt type',
					description: `Record of ${name} could not be changed to normal debt, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to change this record to normal debt?`,
				onConfirm: handleSetNormal
			};
		});
	};

	const handleSetAsHeavy = async (e: SyntheticEvent, verification: Verification) => {
		e.stopPropagation();

		const {record} = verification;
		const {renter} = record as RentalRecord;
		const {name} = renter as User;

		confirmDialogDisclosure.onOpen();

		const handleSetHeavy = async () => {
			try {
				await editVerification(verification.verificationId, {
					isRecordSerious: true
				});

				// Clear row selections
				normalDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				onInfoClose();
				// Update data
				refetch();
				toast({
					title: 'Debt type changed',
					description: `Record of ${name} have been changed to heavy debt.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set debt type',
					description: `Record of ${name} could not be changed to heavy debt, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to change this record to heavy debt?`,
				onConfirm: handleSetHeavy
			};
		});
	};

	const handleSetAsNormalForRows = async (verifications: Verification[]) => {
		confirmDialogDisclosure.onOpen();

		const handleSetNormal = async () => {
			try {
				for (const verification of verifications) {
					await editVerification(verification.verificationId, {
						isRecordSerious: false
					});
				}

				// Clear row selections
				heavyDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Debt type changed',
					description: `Record of ${name} have been changed to normal debt.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set debt type',
					description: `Record of ${name} could not be changed to normal debt, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to change this record to normal debt?`,
				onConfirm: handleSetNormal
			};
		});
	};

	const handleSetAsHeavyForRows = async (verifications: Verification[]) => {
		confirmDialogDisclosure.onOpen();

		const handleSetHeavy = async () => {
			try {
				for (const verification of verifications) {
					await editVerification(verification.verificationId, {
						isRecordSerious: false
					});
				}

				// Clear row selections
				heavyDebtTableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Debt type changed',
					description: `Record of ${name} have been changed to heavy debt.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to set debt type',
					description: `Record of ${name} could not be changed to heavy debt, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to change this record to heavy debt?`,
				onConfirm: handleSetHeavy
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

		// FILTERS
		normalDebtTableState,
		initialFilterValueState_normalDebtTable,
		initialSortingState_normalDebtTable,
		initialSortingState_normalDebtSummaryTable,
		searchTextState_normalDebtTable, // Global filter search
		tableFiltersState_normalDebtTable,
		tableFiltersState_normalDebtSummaryTable,
		tableSortingState_normalDebtTable,
		tableSortingState_normalDebtSummaryTable,
		paginationState_normalDebtTable,
		rowSelectionState_normalDebtTable,

		heavyDebtTableState,
		initialFilterValueState_heavyDebtTable,
		initialSortingState_heavyDebtTable,
		initialSortingState_heavyDebtSummaryTable,
		searchTextState_heavyDebtTable, // Global filter search
		tableFiltersState_heavyDebtTable,
		tableFiltersState_heavyDebtSummaryTable,
		tableSortingState_heavyDebtTable,
		tableSortingState_heavyDebtSummaryTable,
		paginationState_heavyDebtTable,
		rowSelectionState_heavyDebtTable,

		handleInitTable,
		refetch,

		// ACTIONS
		handleSetAsPaidNormal,
		handleSetAsPaidHeavy,
		handleSetAsPaidForRowsNormal,
		handleSetAsPaidForRowsHeavy,
		handleSetAsNormal,
		handleSetAsHeavy,
		handleSetAsNormalForRows,
		handleSetAsHeavyForRows
	};
};

const dummyVerifications: Verification[] = [
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'delasd',
				email: 'delEmail',
				status: 'pending',
				type: 'admin',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},

	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Proof',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12,
					proofOfReturn:
						'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date('2024-7-21'),
		verifiedAt: new Date('2024-12-31'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'pending',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Return',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'return_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_reverifying',
			rentedAt: new Date('2023-2-1'),
			expectedReturnAt: new Date('2023-2-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'ABC123',
			recordTitle: 'Hello',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'return_rejected',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
			returnedAt: new Date(),
			returnImages: [],
			returnLocation: ''
		},
		isRecordSerious: true,
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'B123',
			recordTitle: 'Goodbye',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'return_rejected',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
			returnImages: [],
			returnLocation: ''
		},
		isRecordSerious: true,
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'R123',
			recordTitle: 'Reject',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'rent_rejected',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'R123',
			recordTitle: 'ReturnRej',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'return_rejected',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		verificationId: 'V321',
		record: {
			recordId: 'A123',
			recordTitle: 'Proof',
			renter: {
				id: 'PJtSBgLgeBtbgg5NES2Z',
				name: 'pjt',
				email: 'pjtEmail',
				status: 'pending',
				type: 'user',
				createdAt: new Date('2023-2-1'),
				imageUrls: [
					'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
				]
			},
			rentingItems: [
				{
					item: {
						itemId: 'ABC123',
						itemName: 'Beaker',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 10
				},
				{
					item: {
						itemId: 'ABC1234',
						itemName: 'Airhorn',
						itemImages: [],
						itemQuantity: 123,
						createdAt: new Date(),
						createdBy: {
							id: 'delpttcjBgZhHaPS5QuL',
							name: 'delasd',
							email: 'delEmail',
							status: 'pending',
							type: 'admin',
							createdAt: new Date('2023-2-1'),
							imageUrls: [
								'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
							]
						},
						itemStatus: 'pending'
					},
					rentQuantity: 12
				}
			],
			rentImages: [],
			notes: 'World, hello!',
			recordStatus: 'active',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
			returnImages: [],
			returnLocation: ''
		},
		createdAt: new Date(),
		verifiedAt: new Date('31-12-2024'),
		verifiedBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	}
];

// const dummyRecords: RentalRecord[] = [
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Hello',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'active',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-5'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Hello1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'active',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-5'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: '2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'active',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Returning',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'returning',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2024-7-17'),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Returning1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'returning',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Returning2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'returning2',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'RentnearDue',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'rent_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'RentnearDue1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'rent_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'RentnearDue2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'rent_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'ReturnnearDue',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'return_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'ReturnnearDue1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'return_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'ReturnnearDue2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'return_rejected',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Completed',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'completed',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Completed1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'completed',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Completed2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'completed',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Paid',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'paid',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Paid1',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'paid',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	},
// 	{
// 		recordId: 'ABC123',
// 		recordTitle: 'Paid2',
// 		renter: {
// 			id: 'PJtSBgLgeBtbgg5NES2Z',
// 			name: 'pjt',
// 			email: 'pjtEmail',
// 			status: 'pending',
// 			type: 'user',
// 			createdAt: new Date('2023-2-1'),
// 			imageUrls: [
// 				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 			]
// 		},
// 		rentingItems: [
// 			{
// 				item: {
// 					itemId: 'ABC123',
// 					itemName: 'Beaker',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 10
// 			},
// 			{
// 				item: {
// 					itemId: 'ABC1234',
// 					itemName: 'Airhorn',
// 					itemImages: [],
// 					itemQuantity: 123,
// 					createdAt: new Date(),
// 					createdBy: {
// 						id: 'delpttcjBgZhHaPS5QuL',
// 						name: 'delasd',
// 						email: 'delEmail',
// 						status: 'pending',
// 						type: 'admin',
// 						createdAt: new Date('2023-2-1'),
// 						imageUrls: [
// 							'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
// 						]
// 					},
// 					itemStatus: 'pending'
// 				},
// 				rentQuantity: 12
// 			}
// 		],
// 		rentImages: [],
// 		notes: 'World, hello!',
// 		recordStatus: 'paid',
// 		rentedAt: new Date('2023-2-1'),
// 		expectedReturnAt: new Date('2023-2-6'),
// 		returnedAt: new Date(),
// 		returnImages: [],
// 		returnLocation: ''
// 	}
// ];

export const DebtTableContext = createContext<
	ReturnType<typeof useInitialDebtTableContext> | undefined
>(undefined);

export const useDebtTableContext = () => useContext(DebtTableContext);
