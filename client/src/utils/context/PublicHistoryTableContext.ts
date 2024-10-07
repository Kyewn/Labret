import {getAllRecords} from '@/db/record';
import {RentalRecord} from '@/utils/data';
import {useDisclosure} from '@chakra-ui/react';
import {
	ColumnFiltersState,
	ColumnSort,
	PaginationState,
	RowSelectionState,
	SortingState,
	Table
} from '@tanstack/react-table';
import {addDays} from 'date-fns';
import {createContext, useContext, useState} from 'react';

// TABLE STRUCTURES
export const useInitialPublicHistoryTableContext = () => {
	// Table data states
	const tabState = useState<number>(0);
	const initDataState = useState<RentalRecord[] | undefined>(undefined);
	const tableDataState = useState<RentalRecord[] | undefined>(undefined);
	const selectedDataState = useState<RentalRecord | undefined>(undefined);

	const infoDisclosure = useDisclosure(); // Item modal

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

	const nearDueTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_nearDueTable = useState('');
	const initialFilterValueState_nearDueTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_nearDueTable] = initialFilterValueState_nearDueTable;
	const tableFiltersState_nearDueTable = useState<ColumnFiltersState>(
		initialFilterValue_nearDueTable
	);
	const initialSortingState_nearDueTable = [{id: 'recordStatus', desc: true}];
	const tableSortingState_nearDueTable = useState<SortingState>(initialSortingState_nearDueTable);
	const paginationState_nearDueTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_nearDueTable = useState<RowSelectionState>({});

	const completedTableState = useState<Table<RentalRecord> | undefined>(undefined);
	const searchTextState_completedTable = useState('');
	const initialFilterValueState_completedTable = useState<ColumnFiltersState>([]);
	const [initialFilterValue_completedTable] = initialFilterValueState_completedTable;
	const tableFiltersState_completedTable = useState<ColumnFiltersState>(
		initialFilterValue_completedTable
	);
	const initialSortingState_completedTable: ColumnSort[] = [];
	const tableSortingState_completedTable = useState<SortingState>(
		initialSortingState_completedTable
	);
	const paginationState_completedTable = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState_completedTable = useState<RowSelectionState>({});

	const [, setActiveTable] = activeTableState;
	const [, setNearDueTable] = nearDueTableState;
	const [, setCompletedTable] = completedTableState;

	const handleInitTable = (tableIdx: number, table: Table<RentalRecord>) => {
		switch (tableIdx) {
			case 0:
				setActiveTable(table);
				break;
			case 1:
				setNearDueTable(table);
				break;
			case 2:
				setCompletedTable(table);
				break;
		}
	};

	const refetch = async () => {
		const data = await getAllRecords();

		setInitData(() => {
			switch (tab) {
				case 0: {
					const tableData = data.filter(
						(record) =>
							record.recordStatus == 'active' ||
							record.recordStatus == 'returning' ||
							record.recordStatus == 'return_reverifying'
					);
					setTableData(tableData);
					break;
				}
				case 1: {
					const tableData = data.filter(
						(record) =>
							new Date() < (record.expectedReturnAt as Date) &&
							(record.expectedReturnAt as Date) <= addDays(new Date(), 5) &&
							!record.returnedAt
					);
					setTableData(tableData);
					break;
				}
				case 2: {
					const tableData = data.filter(
						(item) =>
							item.recordStatus == 'completed' ||
							item.recordStatus == 'rent_rejected' ||
							item.recordStatus == 'return_rejected' ||
							item.recordStatus == 'paid'
					);
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

		nearDueTableState,
		initialFilterValueState_nearDueTable,
		initialSortingState_nearDueTable,
		searchTextState_nearDueTable, // Global filter search
		tableFiltersState_nearDueTable,
		tableSortingState_nearDueTable,
		paginationState_nearDueTable,
		rowSelectionState_nearDueTable,

		handleInitTable,
		refetch

		// ACTIONS
	};
};

export const PublicHistoryTableContext = createContext<
	ReturnType<typeof useInitialPublicHistoryTableContext> | undefined
>(undefined);

export const usePublicHistoryTableContext = () => useContext(PublicHistoryTableContext);
