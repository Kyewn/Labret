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

export function ViewAdmins() {
	const {appDispatch} = useAppContext();
	const usersTableContext = useInitialUserTableContext('admins');
	const infoDisclosure = useDisclosure(); // Selection actions modal
	const {onOpen: onInfoOpen} = infoDisclosure; // Selection actions modal
	const [canNext, setCanNext] = useState(false);
	const [canPrev, setCanPrev] = useState(false);

	const {
		data,
		selectedDataState,
		tableState,
		selectionDisclosure,
		// initialFilterValueState,
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
	// const [, setInitialFilterValue] = initialFilterValueState;
	// const [, setFilters] = tableFiltersState;
	const confirmDisclosure = confirmDialogDisclosure;
	const [{title: confirmTitle, description: confirmDescription, onConfirm}] = confirmDialogState;

	const pageBottomRef = useRef<HTMLDivElement | null>(null);
	const pageIndex = useMemo(() => paginationState[0].pageIndex, [paginationState]);

	const handleTrainModel = async () => {
		try {
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'training'
			});
			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			const result = await fetch('http://localhost:8000/train-face-lts-model');
			const {acc_top1} = await result.json();

			if (acc_top1 > 0.7) {
				toast({
					title: 'Face model training successful',
					description: `Model accuracy: ${Number(acc_top1 * 100).toPrecision(3)}%`,
					status: 'success',
					duration: null,
					isClosable: true
				});
			} else {
				toast({
					title: 'Insufficient face model training',
					description: `Model accuracy: ${Number(acc_top1 * 100).toPrecision(3)}%`,
					status: 'warning',
					duration: null,
					isClosable: true
				});
			}

			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'default'
			});
		} catch {
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'default'
			});
			toast({
				title: 'Training interrupted',
				description: 'Something went wrong during face training, please try again.',
				status: 'error',
				duration: null,
				isClosable: true
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

	return (
		<>
			<Helmet>
				<title>View Admins</title>
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
						<Heading size={'md'}>Admins</Heading>
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
									'Enable after checking annotations. User recognition model needs to be updated everytime new users are added and after a new Roboflow version is published.'
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
						columns={getUserColumns(onOpen, onClose, handleSetActive, handleDelete, true)}
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
