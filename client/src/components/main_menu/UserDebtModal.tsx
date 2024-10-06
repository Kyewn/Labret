import {HeavyDebtSummaryTableFilters} from '@/components/main_menu/HeavyDebtSummaryTableFilters';
import {NormalDebtSummaryTableFilters} from '@/components/main_menu/NormalDebtSummaryTableFilters';
import {DataTable} from '@/components/ui/DataTable/DataTable';
import {getHeavyDebtSummaryColumns, getNormalDebtSummaryColumns} from '@/utils/columns';
import {useAppContext} from '@/utils/context/AppContext';
import {DebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {mapPaymentAmount, RentalRecord, User} from '@/utils/data';

import {
	Divider,
	Flex,
	HStack,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	Tab,
	TabList,
	Tabs,
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {useEffect} from 'react';

export const UserDebtModal: React.FC<{
	disclosure: ReturnType<typeof useDisclosure>;
}> = ({disclosure}) => {
	const {
		appState: {user},
		appDispatch
	} = useAppContext();
	const {isOpen, onClose} = disclosure;
	const debtTableContext = useInitialDebtTableContext();
	const {
		initData,
		tableData,
		refetch,
		tabState,
		searchTextState_normalDebtTable,
		searchTextState_heavyDebtTable,
		tableFiltersState_normalDebtSummaryTable,
		tableFiltersState_heavyDebtSummaryTable,
		tableSortingState_normalDebtSummaryTable,
		tableSortingState_heavyDebtSummaryTable,
		handleInitTable
	} = debtTableContext;
	const [tab, setTab] = tabState;

	const userData = tableData?.filter(
		(data) => ((data.record as RentalRecord).renter as User).id == user?.id
	);
	const totalOutstanding = tableData?.reduce(
		(acc, curr) => acc + mapPaymentAmount(curr.record as RentalRecord),
		0
	);

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
		<Modal scrollBehavior={'inside'} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={'60%'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					<DebtTableContext.Provider value={debtTableContext}>
						<Tabs
							index={tab}
							onChange={(index: number) => setTab(index)}
							display={'flex'}
							flex={1}
							flexDirection={'column'}
							p={3}
							paddingX={10}
							height={'100%'}
						>
							<HStack spacing={10} paddingBottom={3}>
								<TabList>
									<Tab>Normal</Tab>
									<Tab>Heavy</Tab>
								</TabList>
							</HStack>
							<Divider orientation='horizontal' />
							{tab == 0 && (
								/* Normal debt*/
								<VStack flex={1} maxH={'100%'} overflowY={'auto'}>
									<NormalDebtSummaryTableFilters />
									<Flex flex={1} w={'100%'} overflow={'auto'}>
										<DataTable
											data={userData || []}
											columns={getNormalDebtSummaryColumns()}
											sortingState={tableSortingState_normalDebtSummaryTable}
											globalFilterState={searchTextState_normalDebtTable}
											filterState={tableFiltersState_normalDebtSummaryTable}
											handleInitTable={(table) => handleInitTable(0, table)}
										/>
									</Flex>
									<Flex w={'100%'} justifyContent={'flex-end'}>
										<Text fontSize={'sm'}>Total Outstanding: {totalOutstanding}</Text>
									</Flex>
								</VStack>
							)}
							{tab == 1 && (
								/* Heavy debt */
								<VStack flex={1} maxH={'100%'} overflowY={'auto'}>
									<HeavyDebtSummaryTableFilters />
									<Flex flex={1} w={'100%'} overflow={'auto'}>
										<DataTable
											data={userData || []}
											columns={getHeavyDebtSummaryColumns()}
											sortingState={tableSortingState_heavyDebtSummaryTable}
											globalFilterState={searchTextState_heavyDebtTable}
											filterState={tableFiltersState_heavyDebtSummaryTable}
											handleInitTable={(table) => handleInitTable(1, table)}
										/>
									</Flex>
								</VStack>
							)}
						</Tabs>
					</DebtTableContext.Provider>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
