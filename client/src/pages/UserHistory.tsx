import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {ActiveTable} from '@/components/user_history/ActiveTable';
import {AllTable} from '@/components/user_history/AllTable';
import {CompletedTable} from '@/components/user_history/CompletedTable';
import {RejectedTable} from '@/components/user_history/RejectedTable';
import {UserHistoryItemModal} from '@/components/user_history/UserHistoryItemModal';
import {useAppContext} from '@/utils/context/AppContext';
import {
	useInitialUserHistoryTableContext,
	UserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
import {paths} from '@/utils/paths';
import {Divider, Flex, Heading, HStack, Tab, TabList, Tabs} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useNavigate} from 'react-router-dom';

export function UserHistory() {
	const {appDispatch} = useAppContext();
	const userHistoryTableContext = useInitialUserHistoryTableContext();

	const {
		initData,
		tabState,
		confirmDialogState,
		confirmDialogDisclosure,
		infoDisclosure,

		refetch
	} = userHistoryTableContext;
	const [tab, setTab] = tabState;
	const navigate = useNavigate();

	const confirmDisclosure = confirmDialogDisclosure;
	const [{title: confirmTitle, description: confirmDescription, onConfirm}] = confirmDialogState;

	const handleRefetch = async () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		refetch();
		appDispatch({type: 'SET_PAGE_LOADING', payload: false});
	};

	useEffect(() => {
		if (!initData) {
			handleRefetch();
		}
	}, [initData]);

	useEffect(() => {
		// Set filtered data on tab change
		refetch();
	}, [tab]);

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				navigate(paths.main.root);
			}
		});
	}, []);

	return (
		<>
			<Helmet>
				<title>User History</title>
			</Helmet>

			<UserHistoryTableContext.Provider value={userHistoryTableContext}>
				<ConfirmDialog
					disclosure={confirmDisclosure}
					title={confirmTitle}
					description={confirmDescription}
					onConfirm={onConfirm}
				/>
				<UserHistoryItemModal disclosure={infoDisclosure} />
				<Tabs
					index={tab}
					onChange={(index: number) => setTab(index)}
					flex={1}
					flexDirection={'column'}
					justifyContent={'center'}
					p={3}
					paddingX={10}
				>
					<HStack spacing={10}>
						<Flex marginY={3} alignItems={'center'}>
							<Heading size={'md'}>User History</Heading>
						</Flex>
						<TabList>
							<Tab>Active</Tab>
							<Tab>Completed</Tab>
							<Tab>Rejected</Tab>
							<Tab>All</Tab>
						</TabList>
					</HStack>
					<Divider orientation='horizontal' />
					{tab == 0 && (
						/* Active */
						<ActiveTable />
					)}
					{tab == 1 && (
						/* Completed */
						<CompletedTable />
					)}
					{tab == 2 && (
						/* Completed */
						<RejectedTable />
					)}
					{tab == 3 && (
						/* Completed */
						<AllTable />
					)}
				</Tabs>
			</UserHistoryTableContext.Provider>
		</>
	);
}
