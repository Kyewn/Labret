import {Item, ItemAvailabilityRecordValues, RentalRecord} from '@/utils/data';
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
	const initRecordsState = useState<RentalRecord[] | undefined>(undefined);
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
		setInitRecords(records);
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
		itemStatus: 'pending',
		remainingQuantity: 12
	},
	{
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
		itemStatus: 'pending',
		remainingQuantity: 100
	}
];

const dummyRecords: RentalRecord[] = [
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-5'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: '2',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning',
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
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2024-7-17'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning1',
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
		recordStatus: 'returning',
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Returning2',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue1',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'RentnearDue2',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue1',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'ReturnnearDue2',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed1',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Completed2',
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
		rentedAt: new Date('2023-2-1'),
		expectedReturnAt: new Date('2023-2-6'),
		returnedAt: new Date(),
		returnImages: [],
		returnLocation: ''
	},
	{
		recordId: 'ABC123',
		recordTitle: 'Paid',
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
