import {DebtItemModal} from '@/components/settle_debts/DebtItemModal';
import {HeavyDebtTable} from '@/components/settle_debts/HeavyDebtTable';
import {NormalDebtTable} from '@/components/settle_debts/NormalDebtTable';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {useAppContext} from '@/utils/context/AppContext';
import {DebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {Divider, Flex, Heading, HStack, Tab, TabList, Tabs} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';

export function SettleDebts() {
	const {appDispatch} = useAppContext();
	const debtTableContext = useInitialDebtTableContext();

	const {initData, tabState, confirmDialogState, confirmDialogDisclosure, infoDisclosure, refetch} =
		debtTableContext;
	const [tab, setTab] = tabState;

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

	return (
		<>
			<Helmet>
				<title>Track debts</title>
			</Helmet>

			<DebtTableContext.Provider value={debtTableContext}>
				<ConfirmDialog
					disclosure={confirmDisclosure}
					title={confirmTitle}
					description={confirmDescription}
					onConfirm={onConfirm}
				/>

				<DebtItemModal disclosure={infoDisclosure} />
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
							<Heading size={'md'}>Debts</Heading>
						</Flex>
						<TabList>
							<Tab>Normal</Tab>
							<Tab>Heavy</Tab>
						</TabList>
					</HStack>
					<Divider orientation='horizontal' />
					{tab == 0 && (
						/* Normal debt*/
						<NormalDebtTable />
					)}
					{tab == 1 && (
						/* Heavy debt */
						<HeavyDebtTable />
					)}
				</Tabs>
			</DebtTableContext.Provider>
		</>
	);
}
