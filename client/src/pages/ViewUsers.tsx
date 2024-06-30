import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {UserFilters} from '@/components/view_users/UserFilters';
import {UserItemModal} from '@/components/view_users/UserItemModal';
import {getUserColumns} from '@/utils/columns';
import {useAppContext} from '@/utils/context/AppContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {UserTableContext, useInitialUserTableContext} from '@/utils/context/UsersTableContext';
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
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import {ChevronDown, SquareCheck} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';

export function ViewUsers() {
	const {appDispatch} = useAppContext();
	const usersTableContext = useInitialUserTableContext();
	const infoDisclosure = useDisclosure(); // Selection actions modal
	const {onOpen: onInfoOpen} = infoDisclosure; // Selection actions modal
	const [canNext, setCanNext] = useState(false);
	const [canPrev, setCanPrev] = useState(false);

	const {
		data,
		selectedDataState,
		tableState,
		selectionDisclosure,
		initialFilterValueState,
		paginationState,
		rowSelectionState,
		searchTextState,
		tableFiltersState,
		tableSortingState,
		handleInitTable,
		refetch,
		handleDelete,
		handleSetActive,
		handleSetActiveForRows,
		handleDeleteForRows,
		confirmDialogState,
		confirmDialogDisclosure
	} = usersTableContext;
	const {isOpen, onOpen, onClose} = selectionDisclosure;
	const [selectedData, setSelectedData] = selectedDataState;
	const multiEditableContext = useMultiEditableContext(selectedData);
	const toast = useToast();
	const [isAnnotationButtonClicked, setIsAnnotationButtonClicked] = useState(false);
	const [table] = tableState;
	const [rowSelection] = rowSelectionState;
	const [, setInitialFilterValue] = initialFilterValueState;
	const [, setFilters] = tableFiltersState;
	const confirmDisclosure = confirmDialogDisclosure;
	const [{title: confirmTitle, description: confirmDescription, onConfirm}] = confirmDialogState;

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => paginationState[0].pageIndex, [paginationState]);

	const handleTrainModel = async () => {
		try {
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL',
				payload: 'Downloading and training new images. This could take awhile.'
			});
			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			await fetch('http://localhost:8000/train-face-lts-model');
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL',
				payload: 'Loading'
			});
		} catch {
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL',
				payload: 'Loading'
			});
			toast({
				title: 'Training interrupted',
				description: 'Something went wrong during face training, please try again.',
				status: 'error',
				duration: 3000
			});
		}
	};

	const handleRowClick = (data: User) => {
		setSelectedData(data);
		onInfoOpen();
	};

	const handleRefetch = async () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		refetch();
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	useEffect(() => {
		if (!data) {
			handleRefetch();
		} else {
			const oldestDate = new Date(
				data.reduce((currOld, curr) => {
					return new Date(curr.createdAt) < new Date(currOld.createdAt) ? curr : currOld;
				}).createdAt
			);
			oldestDate.setHours(0, 0, 0, 0);
			// Overwrite default date filter to include past registration dates
			setFilters((prev) => {
				const otherFilters = prev.filter((f) => f.id !== 'createdAt');
				return [...otherFilters, {id: 'createdAt', value: {from: oldestDate}}];
			});
			setInitialFilterValue((prev) => {
				const otherFilters = prev.filter((f) => f.id !== 'createdAt');
				return [...otherFilters, {id: 'createdAt', value: {from: oldestDate}}];
			});
		}
	}, [data]);

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
	// - Retrain func

	return (
		<>
			<Helmet>
				<title>View Users</title>
			</Helmet>

			<UserTableContext.Provider value={usersTableContext}>
				<ConfirmDialog
					disclosure={confirmDisclosure}
					title={confirmTitle}
					description={confirmDescription}
					onConfirm={onConfirm}
				/>
				<UserItemModal multiEditableContext={multiEditableContext} disclosure={infoDisclosure} />

				<Flex flex={1} flexDirection={'column'} justifyContent={'center'} p={3} paddingX={10}>
					<Flex marginY={3} alignItems={'center'}>
						<Heading size={'md'}>Users</Heading>
						<Spacer />
						<HStack>
							<Tooltip
								hasArrow
								label={
									'Label face images for AI model in Roboflow. Publish a new version after all new annotations are completed'
								}
								placement='bottom-start'
								borderRadius={5}
							>
								<Link
									style={{width: 'unset'}}
									to={'https://app.roboflow.com/oowus-workspace/labret-face/annotate'}
									target='_blank'
									onClick={() => setIsAnnotationButtonClicked(true)}
								>
									<Button variant={'outline'}>Check Annotations</Button>
								</Link>
							</Tooltip>
							<Tooltip
								hasArrow
								label={
									'Enable after checking annotations. User recognition model needs to be updated everytime a new Roboflow version is published.'
								}
								placement='bottom-start'
								borderRadius={5}
							>
								<Button isDisabled={!isAnnotationButtonClicked} onClick={handleTrainModel}>
									Retrain user model
								</Button>
							</Tooltip>
						</HStack>
					</Flex>
					<Divider orientation='horizontal' />
					<UserFilters />
					<DataTable
						columns={getUserColumns(onOpen, onClose, handleSetActive, handleDelete)}
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
								<Button
									onClick={() => {
										const selectedUsers = Object.keys(rowSelection).map((key) => {
											const user = table?.getRow(key).original;
											return user as User;
										});

										handleSetActiveForRows(selectedUsers);
									}}
								>
									Set Active
								</Button>
								<Button
									variant={'secondary'}
									onClick={() => {
										const selectedUsers = Object.keys(rowSelection).map((key) => {
											const user = table?.getRow(key).original;
											return user as User;
										});

										handleDeleteForRows(selectedUsers);
									}}
								>
									Reject
								</Button>
							</ButtonGroup>
						</Flex>
					</HStack>
				</Slide>
			</UserTableContext.Provider>
		</>
	);
}
