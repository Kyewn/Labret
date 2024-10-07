import {getAllItems} from '@/db/item';
import {getAllRecords} from '@/db/record';
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
		const records = await getAllRecords();
		const items = await getAllItems();

		const parsedItems = items.map((item) => {
			const relatedRecords = records.filter(
				(record) =>
					record.recordStatus !== 'completed' &&
					record.recordStatus !== 'paid' &&
					record.rentingItems.some(
						(rentingItem) => (rentingItem.item as Item).itemId === item.itemId
					) &&
					record.expectedReturnAt
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

export const ItemAvailabilityTableContext = createContext<
	ReturnType<typeof useInitialItemAvailabilityTableContext> | undefined
>(undefined);

export const useItemAvailabilityTableContext = () => useContext(ItemAvailabilityTableContext);
