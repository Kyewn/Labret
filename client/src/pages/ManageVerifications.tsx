import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {RentTable} from '@/components/verifications/RentTable';
import {ReturnTable} from '@/components/verifications/ReturnTable';
import {VerificationItemModal} from '@/components/verifications/VerificationItemModal';
import {useAppContext} from '@/utils/context/AppContext';
import {
	useInitialVerificationTableContext,
	VerificationTableContext
} from '@/utils/context/VerificationTableContext';
import {Divider, Flex, Heading, HStack, Tab, TabList, Tabs} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';

export function ManageVerifications() {
	const {appDispatch} = useAppContext();
	const verificatioNTableContext = useInitialVerificationTableContext();

	const {
		initData,
		tabState,
		confirmDialogState,
		confirmDialogDisclosure,
		infoDisclosure,

		refetch
	} = verificatioNTableContext;
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
				<title>Verifications</title>
			</Helmet>

			<VerificationTableContext.Provider value={verificatioNTableContext}>
				<ConfirmDialog
					disclosure={confirmDisclosure}
					title={confirmTitle}
					description={confirmDescription}
					onConfirm={onConfirm}
				/>
				<VerificationItemModal disclosure={infoDisclosure} />
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
							<Heading size={'md'}>Verifications</Heading>
						</Flex>
						<TabList>
							<Tab>Rents</Tab>
							<Tab>Returns</Tab>
						</TabList>
					</HStack>
					<Divider orientation='horizontal' />
					{tab == 0 && (
						/* Rents */
						<RentTable />
					)}
					{tab == 1 && (
						/* Returns */
						<ReturnTable />
					)}
				</Tabs>
			</VerificationTableContext.Provider>
		</>
	);
}
