import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {RentalRecord} from '@/utils/data';
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
export const useInitialUserHistoryTableContext = () => {
	// Table data states
	const tabState = useState<number>(0);
	const initDataState = useState<RentalRecord[] | undefined>(undefined);
	const tableDataState = useState<RentalRecord[] | undefined>(undefined);
	const selectedDataState = useState<RentalRecord | undefined>(undefined);

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
	const activeTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_activeTable = useState('');
	const initialFilterValueState_activeTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_activeTable] = initialFilterValueState_activeTable;
	const tableFiltersState_activeTable = useState<ColumnFiltersState>(
		initialFilterValue_activeTable
	);
	const initialSortingState_activeTable: SortingState = [{id: 'recordStatus', desc: true}];
	const tableSortingState_activeTable = useState<SortingState>(initialSortingState_activeTable);
	const paginationState_activeTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_activeTable = useState<RowSelectionState>({});

	const completedTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_completedTable = useState('');
	const initialFilterValueState_completedTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_completedTable] = initialFilterValueState_completedTable;
	const tableFiltersState_completedTable = useState<ColumnFiltersState>(
		initialFilterValue_completedTable
	);
	const initialSortingState_completedTable = [{id: 'recordStatus', desc: false}];
	const tableSortingState_completedTable = useState<SortingState>(
		initialSortingState_completedTable
	);
	const paginationState_completedTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_completedTable = useState<RowSelectionState>({});

	const rejectedTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_rejectedTable = useState('');
	const initialFilterValueState_rejectedTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_rejectedTable] = initialFilterValueState_rejectedTable;
	const tableFiltersState_rejectedTable = useState<ColumnFiltersState>(
		initialFilterValue_rejectedTable
	);
	const initialSortingState_rejectedTable = [{id: 'recordStatus', desc: true}];
	const tableSortingState_rejectedTable = useState<SortingState>(initialSortingState_rejectedTable);
	const paginationState_rejectedTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_rejectedTable = useState<RowSelectionState>({});

	const allTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_allTable = useState('');
	const initialFilterValueState_allTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_allTable] = initialFilterValueState_allTable;
	const tableFiltersState_allTable = useState<ColumnFiltersState>(initialFilterValue_allTable);
	const initialSortingState_allTable = [{id: 'recordStatus', desc: true}];
	const tableSortingState_allTable = useState<SortingState>(initialSortingState_allTable);
	const paginationState_allTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_allTable = useState<RowSelectionState>({});

	const [, setActiveTable] = activeTableState;
	const [, setCompletedTable] = completedTableState;
	const [, setRejectedTable] = rejectedTableState;
	const [, setAllTable] = allTableState;

	const handleInitTable = (tableIdx: number, table: Table<RentalRecord>) => {
		switch (tableIdx) {
			case 0:
				setActiveTable(table);
				break;
			case 1:
				setCompletedTable(table);
				break;
			case 2:
				setRejectedTable(table);
				break;
			case 3:
				setAllTable(table);
				break;
		}
	};

	const refetch = async () => {
		const data = dummyItems;

		setInitData(() => {
			switch (tab) {
				case 0: {
					const tableData = data.filter(
						(item) =>
							item.recordStatus == 'active' ||
							item.recordStatus == 'pending' ||
							item.recordStatus == 'returning' ||
							item.recordStatus == 'rent_reverifying' ||
							item.recordStatus == 'return_reverifying'
					);
					setTableData(tableData);
					break;
				}
				case 1: {
					const tableData = data.filter(
						(item) => item.recordStatus == 'completed' || item.recordStatus == 'paid'
					);
					setTableData(tableData);
					break;
				}
				case 2: {
					const tableData = data.filter(
						(item) => item.recordStatus == 'rent_rejected' || item.recordStatus == 'return_rejected'
					);
					setTableData(tableData);
					break;
				}
				case 3: {
					const tableData = data;
					setTableData(tableData);
					break;
				}
			}
			return data;
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
		activeTableState,
		initialFilterValueState_activeTable,
		initialSortingState_activeTable,
		searchTextState_activeTable, // Global filter search
		tableFiltersState_activeTable,
		tableSortingState_activeTable,
		paginationState_activeTable,
		rowSelectionState_activeTable,

		completedTableState,
		initialFilterValueState_completedTable,
		initialSortingState_completedTable,
		searchTextState_completedTable, // Global filter search
		tableFiltersState_completedTable,
		tableSortingState_completedTable,
		paginationState_completedTable,
		rowSelectionState_completedTable,

		rejectedTableState,
		initialFilterValueState_rejectedTable,
		initialSortingState_rejectedTable,
		searchTextState_rejectedTable, // Global filter search
		tableFiltersState_rejectedTable,
		tableSortingState_rejectedTable,
		paginationState_rejectedTable,
		rowSelectionState_rejectedTable,

		allTableState,
		initialFilterValueState_allTable,
		initialSortingState_allTable,
		searchTextState_allTable, // Global filter search
		tableFiltersState_allTable,
		tableSortingState_allTable,
		paginationState_allTable,
		rowSelectionState_allTable,

		handleInitTable,
		refetch

		// ACTIONS
	};
};

const dummyItems: RentalRecord[] = [
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	{
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
	}
];

export const UserHistoryTableContext = createContext<
	ReturnType<typeof useInitialUserHistoryTableContext> | undefined
>(undefined);

export const useUserHistoryTableContext = () => useContext(UserHistoryTableContext);
