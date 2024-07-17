import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {ItemTableFilters} from '@/components/view_items/ItemTableFilters';
import {getItemColumns} from '@/utils/columns';
import {useAppContext} from '@/utils/context/AppContext';
import {useInitialItemTableContext, useItemTableContext} from '@/utils/context/ItemTableContext';
import {Item} from '@/utils/data';
import {Button, ButtonGroup, Flex, HStack, IconButton, Slide, Spacer, Text} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';

export const ItemTable = () => {
	const {appDispatch} = useAppContext();
	const {
		dataState,
		selectedDataState,
		infoDisclosure,
		selectionDisclosure,
		confirmDialogDisclosure,
		confirmDialogState,

		tableState,
		paginationState,
		rowSelectionState,
		searchTextState,
		tableFiltersState,
		tableSortingState,

		refetch,
		handleInitTable,

		handleSetActive,
		handleDelete,
		handleSetActiveForRows,
		handleDeleteForRows
	} = useItemTableContext() as ReturnType<typeof useInitialItemTableContext>;

	const {onOpen, isOpen, onClose} = selectionDisclosure;
	const confirmDisclosure = confirmDialogDisclosure;
	const [{title: confirmTitle, description: confirmDescription, onConfirm}] = confirmDialogState;
	const [, setSelectedData] = selectedDataState;
	const [data] = dataState;
	const [table] = tableState;
	const [pagination] = paginationState;
	const [rowSelection] = rowSelectionState;

	const {onOpen: onInfoOpen} = infoDisclosure;
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => pagination && pagination.pageIndex, [pagination]);

	const handleRefetch = async () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		refetch();
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	useEffect(() => {
		if (!data) {
			handleRefetch();
		}
	}, [data]);

	const handleRowClick = (data: Item) => {
		setSelectedData(data);
		onInfoOpen();
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
			<ConfirmDialog
				disclosure={confirmDisclosure}
				title={confirmTitle}
				description={confirmDescription}
				onConfirm={onConfirm}
			/>
			<ItemTableFilters />
			<DataTable
				columns={getItemColumns(onOpen, onClose, handleSetActive, handleDelete)}
				data={data || []}
				paginationState={paginationState}
				rowSelectionState={rowSelectionState}
				globalFilterState={searchTextState}
				filterState={tableFiltersState}
				sortingState={tableSortingState}
				handleInitTable={(table) => handleInitTable(table)}
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
			{!!Object.entries(rowSelection).length && (
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
							{Object.entries(rowSelection).length} of {data?.length} record(s) selected
						</Text>
						<Spacer />
						<ButtonGroup>
							<Button
								onClick={() => {
									const selectedItems = Object.keys(rowSelection).map((key) => {
										const item = table?.getRow(key).original;
										return item as Item;
									});

									handleSetActiveForRows(selectedItems);
								}}
							>
								Set Active
							</Button>
							<Button
								variant={'secondary'}
								onClick={() => {
									const selectedItems = Object.keys(rowSelection).map((key) => {
										const item = table?.getRow(key).original;
										return item as Item;
									});

									handleDeleteForRows(selectedItems);
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
