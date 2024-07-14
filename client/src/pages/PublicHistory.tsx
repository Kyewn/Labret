import {ActiveTable} from '@/components/public_history/ActiveTable';
import {CompletedTable} from '@/components/public_history/CompletedTable';
import {NearDueTable} from '@/components/public_history/NearDueTable';
import {PublicHistoryItemModal} from '@/components/public_history/PublicHistoryItemModal';
import {useAppContext} from '@/utils/context/AppContext';
import {
	PublicHistoryTableContext,
	useInitialPublicHistoryTableContext
} from '@/utils/context/PublicHistoryTableContext';
import {Divider, Flex, Heading, HStack, Tab, TabList, Tabs} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';

export function PublicHistory() {
	const {appDispatch} = useAppContext();
	const publicHistoryTableContext = useInitialPublicHistoryTableContext() as ReturnType<
		typeof useInitialPublicHistoryTableContext
	>;
	const {initDataState, refetch, tabState, infoDisclosure} = publicHistoryTableContext;
	const [initData] = initDataState;
	const [tab, setTab] = tabState;

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

	return (
		<>
			<Helmet>
				<title>Public History</title>
			</Helmet>
			<PublicHistoryTableContext.Provider value={publicHistoryTableContext}>
				<PublicHistoryItemModal disclosure={infoDisclosure} />
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
							<Heading size={'md'}>Public History</Heading>
						</Flex>
						<TabList>
							<Tab>Active</Tab>
							<Tab>Due in 5 Days</Tab>
							<Tab>Completed</Tab>
						</TabList>
					</HStack>
					<Divider orientation='horizontal' />
					{tab == 0 && (
						/* NearDue */
						<NearDueTable />
					)}
					{tab == 1 && (
						/* Active */
						<ActiveTable />
					)}
					{tab == 2 && (
						/* Completed */
						<CompletedTable />
					)}
				</Tabs>
			</PublicHistoryTableContext.Provider>
		</>
	);
}
