import {DataTable} from '@/components/ui/DataTable/DataTable';
import {UserFilters} from '@/components/view_users/UserFilters';
import {getUserColumns} from '@/utils/columns';
import {useAppContext} from '@/utils/context/AppContext';
import {UserTableContext, useUsersTableContext} from '@/utils/context/UsersTableContext';
import {User} from '@/utils/data';
import {
	Button,
	ButtonGroup,
	Divider,
	Flex,
	HStack,
	Heading,
	IconButton,
	Slide,
	Spacer,
	Text,
	Tooltip,
	useDisclosure
} from '@chakra-ui/react';
import {ChevronDown, SquareCheck, Trash} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Helmet} from 'react-helmet-async';

export function ViewUsers() {
	const {appDispatch} = useAppContext();
	const usersTableContext = useUsersTableContext();
	const {isOpen, onOpen, onClose} = useDisclosure(); // Selection actions modal
	const [canNext, setCanNext] = useState(false); // Selection actions modal
	const [canPrev, setCanPrev] = useState(false); // Selection actions modal

	const {
		tableState,
		dataState,
		paginationState,
		rowSelectionState,
		searchTextState,
		tableFiltersState,
		tableSortingState,
		handleInitTable,
		refetch
	} = usersTableContext;
	const [table] = tableState;
	const [data] = dataState;
	const [rowSelection] = rowSelectionState;
	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => paginationState[0].pageIndex, [paginationState]);
	const pendingForTrainingUserIds = useState<string[]>([]);

	const handleRowClick = (data: User) => {
		console.log(data);
	};

	const handleRefetch = async () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		refetch();
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	useEffect(() => {
		handleRefetch();
	}, []);

	// Update pagination state as they change
	useEffect(() => {
		setCanNext(table?.getCanNextPage() || false);
		setCanPrev(table?.getCanPreviousPage() || false);
	}, [paginationState]);

	useEffect(() => {
		pageBottomRef.current?.scrollIntoView({behavior: 'instant'});
	}, [pageIndex]);

	// reqs
	// - Confirmation modal (accept/reject/delete)
	// - Item detail view
	//    -> edit item
	// - Retrain func

	return (
		<>
			<Helmet>
				<title>View Users</title>
			</Helmet>

			<UserTableContext.Provider value={usersTableContext}>
				<Flex flex={1} flexDirection={'column'} justifyContent={'center'} p={3} paddingX={10}>
					<Flex marginY={3} alignItems={'center'}>
						<Heading size={'md'}>Users</Heading>
						<Spacer />
						<Tooltip
							hasArrow
							label={'User recognition model needs to be updated everytime a user is set active.'}
							placement='left'
							borderRadius={5}
						>
							<Button isDisabled={!!pendingForTrainingUserIds.length}>Retrain user model</Button>
						</Tooltip>
					</Flex>
					<Divider orientation='horizontal' />
					<UserFilters />
					<DataTable
						columns={getUserColumns(
							onOpen,
							onClose,
							() => {},
							() => {},
							() => {}
						)}
						data={data || []}
						paginationState={paginationState}
						rowSelectionState={rowSelectionState}
						globalFilterState={searchTextState}
						filterState={tableFiltersState}
						sortingState={tableSortingState}
						handleInitTable={handleInitTable}
						handleRowClick={handleRowClick}
					/>
					<ButtonGroup ref={pageBottomRef} marginY={3} justifyContent={'flex-end'}>
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
				</Flex>

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
								<Button>Set Active</Button>
								<Button variant={'secondary'}>Reject</Button>
								<IconButton aria-label={'delete'} icon={<Trash />} variant={'criticalOutline'} />
							</ButtonGroup>
						</Flex>
					</HStack>
				</Slide>
			</UserTableContext.Provider>
		</>
	);
}
