import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {RentalRecord, Verification} from '@/utils/data';
import {useDisclosure} from '@chakra-ui/react';
import {
	ColumnFiltersState,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {createContext, useContext, useState} from 'react';

// TABLE STRUCTURES
export const useInitialVerificationTableContext = () => {
	// Table data states
	const tabState = useState<number>(0);
	const initDataState = useState<Verification[] | undefined>(undefined);
	const tableDataState = useState<Verification[] | undefined>(undefined);
	const selectedDataState = useState<Verification | undefined>(undefined);

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
	const [tab] = tabState;

	// Separate states for each table
	const rentTableState = useState<Table<Verification> | undefined>(undefined);
	const searchTextState_rentTable = useState('');
	const initialFilterValueState_rentTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_rentTable] = initialFilterValueState_rentTable;
	const tableFiltersState_rentTable = useState<ColumnFiltersState>(initialFilterValue_rentTable);
	const initialSortingState_rentTable: SortingState = [{id: 'recordStatus', desc: true}];
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
	const initialSortingState_returnTable = [{id: 'recordStatus', desc: false}];
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
		const verifications = dummyVerifications;

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
		refetch

		// ACTIONS
	};
};

const dummyVerifications: Verification[] = [
	{
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
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
			recordStatus: 'completed',
			rentedAt: new Date('2023-1-1'),
			expectedReturnAt: new Date('2023-1-5'),
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
		verificationId: '',
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
			recordStatus: 'completed',
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
		verificationId: '',
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
		verificationId: '',
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
		verificationId: '',
		record: {
			recordId: 'A123',
			recordTitle: 'Active',
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

export const VerificationTableContext = createContext<
	ReturnType<typeof useInitialVerificationTableContext> | undefined
>(undefined);

export const useVerificationTableContext = () => useContext(VerificationTableContext);
