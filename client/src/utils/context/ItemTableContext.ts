import {ConfirmDialogProps} from '@/components/ui/ConfirmDialog';
import {deleteItem, editItem, getAllBaseItems} from '@/db/item';
import {Item} from '@/utils/data';
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
export const useInitialItemTableContext = () => {
	// Table data states
	const dataState = useState<Item[] | undefined>(undefined);
	const selectedDataState = useState<Item | undefined>(undefined);

	const infoDisclosure = useDisclosure(); // Item modal
	const selectionDisclosure = useDisclosure(); // Selection actions modal
	const confirmDialogDisclosure = useDisclosure();
	const confirmDialogState = useState<Omit<ConfirmDialogProps, 'disclosure'>>({
		title: 'Are you sure?',
		description: '',
		onConfirm: () => {}
	});

	const [, setData] = dataState;
	const {onClose} = selectionDisclosure;
	const [, setConfirmDialog] = confirmDialogState;
	const toast = useToast();

	// Separate states for each table
	const tableState = useState<Table<Item> | undefined>(undefined);
	const searchTextState = useState('');
	const initialFilterValueState = useState<ColumnFiltersState>([]);
	const [initialFilterValue] = initialFilterValueState;
	const tableFiltersState = useState<ColumnFiltersState>(initialFilterValue);
	const initialSortingState: SortingState = [{id: 'itemName', desc: false}];
	const tableSortingState = useState<SortingState>(initialSortingState);
	const paginationState = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10 // Limit
	});
	const rowSelectionState = useState<RowSelectionState>({});

	const [, setTable] = tableState;

	const handleInitTable = (table: Table<Item>) => {
		setTable(table);
	};

	const refetch = async () => {
		// TODO get db
		const items = await getAllBaseItems();
		setData(items);
	};

	const handleSetActive = async (e: SyntheticEvent, item: Item) => {
		e.stopPropagation();
		const {itemId, itemName} = item;
		confirmDialogDisclosure.onOpen();

		const handleEdit = async () => {
			try {
				await editItem(itemId, {itemStatus: 'active'});
				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Item status updated',
					description: `"${itemName}" has been set as active.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to update item status',
					description: `"${itemName}" status could not be updated, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set "${itemName}" as active?`,
				onConfirm: handleEdit
			};
		});
	};

	const handleDelete = (e: SyntheticEvent, item: Item) => {
		e.stopPropagation();
		const {itemId, itemName} = item;
		confirmDialogDisclosure.onOpen();

		const handleDelete = async () => {
			try {
				await deleteItem(itemId);
				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Item removed',
					description: `"${itemName}" has been removed from the system.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to remove item',
					description: `"${itemName}" could not be removed, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to reject this item (${itemName})?`,
				onConfirm: handleDelete
			};
		});
	};

	const handleSetActiveForRows = (items: Item[]) => {
		// TODO
		confirmDialogDisclosure.onOpen();

		const handleEdit = async () => {
			try {
				for (const item of items) {
					const {itemId} = item;
					await editItem(itemId, {itemStatus: 'active'});
				}

				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Item statuses updated',
					description: `Selected items have been set as active.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to update item statuses',
					description: `Selected item statuses could not be updated, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to set all selected items as active?`,
				onConfirm: handleEdit
			};
		});
	};

	const handleDeleteForRows = (items: Item[]) => {
		confirmDialogDisclosure.onOpen();

		const handleDelete = async () => {
			try {
				for (const item of items) {
					const {itemId} = item;
					// TODO: Send general (reject or delete) email to user notifying deletion
					await deleteItem(itemId);
				}

				// Clear row selections
				tableState[0]?.toggleAllRowsSelected(false); // Clear selected rows (if any)
				onClose();
				// Update data
				refetch();
				toast({
					title: 'Items removed',
					description: `Selected items have been removed from the system.`,
					status: 'success',
					duration: 3000
				});
			} catch {
				toast({
					title: 'Failed to remove items',
					description: `Selected items could not be removed, please try again.`,
					status: 'error',
					duration: 3000
				});
			}
		};
		setConfirmDialog((prev) => {
			return {
				...(prev || {}),
				description: `Are you sure you want to remove selected items?`,
				onConfirm: handleDelete
			};
		});
	};

	return {
		// DATA
		dataState,
		selectedDataState,
		infoDisclosure,
		selectionDisclosure,
		confirmDialogDisclosure,
		confirmDialogState,

		// FILTERS
		tableState,
		initialFilterValueState,
		initialSortingState,
		searchTextState, // Global filter search
		tableFiltersState,
		tableSortingState,
		paginationState,
		rowSelectionState,

		handleInitTable,
		refetch,

		// ACTIONS
		handleDelete,
		handleSetActive,
		handleDeleteForRows,
		handleSetActiveForRows
	};
};

export const ItemTableContext = createContext<
	ReturnType<typeof useInitialItemTableContext> | undefined
>(undefined);

export const useItemTableContext = () => useContext(ItemTableContext);
