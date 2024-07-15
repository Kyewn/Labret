import {getUser} from '@/db/user';
import {Item, ItemAvailabilityRecordValues, PublicHistoryRecordValues} from '@/utils/data';
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
export const useInitialItemAvailabilityTableContext = () => {
	// Table data states
	const tabState = useState<number>(0);

	const initDataState = useState<ItemAvailabilityRecordValues[] | undefined>(undefined);
	const initRecordsState = useState<PublicHistoryRecordValues[] | undefined>(undefined);
	const tableDataState = useState<ItemAvailabilityRecordValues[] | undefined>(undefined);
	const selectedDataState = useState<ItemAvailabilityRecordValues | undefined>(undefined);

	const infoDisclosure = useDisclosure(); // Item modal

	const [initData, setInitData] = initDataState;
	const [, setInitRecords] = initRecordsState;
	const [tableData, setTableData] = tableDataState;

	// Separate states for each table
	const availabilityTableState = useState<Table<ItemAvailabilityRecordValues> | undefined>(
		undefined
	);
	const searchTextState_availabilityTable = useState('');
	const initialFilterValueState_availabilityTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_availabilityTable] = initialFilterValueState_availabilityTable;
	const tableFiltersState_availabilityTable = useState<ColumnFiltersState>(
		initialFilterValue_availabilityTable
	);
	const initialSortingState_availabilityTable: SortingState = [{id: 'itemName', desc: false}];
	const tableSortingState_availabilityTable = useState<SortingState>(
		initialSortingState_availabilityTable
	);
	const paginationState_availabilityTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_availabilityTable = useState<RowSelectionState>({});

	const [, setAvailabilityTable] = availabilityTableState;

	const handleInitTable = (table: Table<ItemAvailabilityRecordValues>) => {
		setAvailabilityTable(table);
	};

	const refetch = async () => {
		// TODO get db
		const records = dummyRecords;
		const items = dummyItems;

		const parsedRecords = await Promise.all(
			records.map(async (record) => {
				const {name: renterName} = await getUser(record.renterId);
				const parsedRentingItems = record.rentingItems.map((rentingItem) => {
					return {
						...rentingItem,
						item: items.find((item) => item.itemId == (rentingItem.item as Item).itemId) as Item
					};
				});

				return {
					...record,
					renterName,
					rentingItems: parsedRentingItems
				};
			})
		);

		const parsedItems = items.map((item) => {
			const relatedRecords = records.filter(
				(record) =>
					record.rentingItems.some(
						(rentingItem) => (rentingItem.item as Item).itemId === item.itemId
					) && record.expectedReturnAt
			);
			const earliestDate = relatedRecords.reduce((acc, record) => {
				const currReturnDate = acc.expectedReturnAt as Date;
				const returnDate = record.expectedReturnAt as Date;
				if (returnDate < currReturnDate) return record;
				return acc;
			}).expectedReturnAt;

			return {
				...item,
				earliestReturnBy: earliestDate as Date
			};
		});

		setInitData(parsedItems);
		setInitRecords(parsedRecords);
		setTableData(parsedItems);
	};

	return {
		// DATA
		initData,
		tableData,
		initDataState,
		initRecordsState,
		tableDataState,
		selectedDataState,
		tabState,
		infoDisclosure,
		// FILTERS
		availabilityTableState,
		initialFilterValueState_availabilityTable,
		initialSortingState_availabilityTable,
		searchTextState_availabilityTable, // Global filter search
		tableFiltersState_availabilityTable,
		tableSortingState_availabilityTable,
		paginationState_availabilityTable,
		rowSelectionState_availabilityTable,

		handleInitTable,
		refetch

		// ACTIONS
	};
};

const dummyItems: Item[] = [
	{
		itemId: 'ABC123',
		itemName: 'Beaker',
		itemImages: [],
		itemQuantity: 123,
		remainingQuantity: 12
	},
	{
		itemId: 'ABC1234',
		itemName: 'Airhorn',
		itemImages: [],
		itemQuantity: 123,
		remainingQuantity: 100
	}
];

const dummyRecords: PublicHistoryRecordValues[] = [
	{
		recordId: 'ABC123',
		recordTitle: 'Hello',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'active',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-5'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Hello1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'active',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-5'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: '2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'active',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2024-7-17'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'returning2',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'rent_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'return_rejected',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'completed',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid1',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid2',
		renterId: 'PJtSBgLgeBtbgg5NES2Z',
		rentingItems: [
			{
				item: {
					itemId: 'ABC123',
					itemName: 'Beaker',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 10
			},
			{
				item: {
					itemId: 'ABC1234',
					itemName: 'Airhorn',
					itemImages: [],
					itemQuantity: 123
				},
				rentQuantity: 12
			}
		],
		rentImages: [],
		notes: 'World, hello!',
		recordStatus: 'paid',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	}
];

export const ItemAvailabilityTableContext = createContext<
	ReturnType<typeof useInitialItemAvailabilityTableContext> | undefined
>(undefined);

export const useItemAvailabilityTableContext = () => useContext(ItemAvailabilityTableContext);
