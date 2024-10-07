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
import {ToastType} from '@/utils/utils';
import {Divider, Flex, Heading, HStack, Tab, TabList, Tabs} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useLocation, useNavigate} from 'react-router-dom';

export type LocationState = {
	toastType: ToastType;
};

export function UserHistory() {
	const {appDispatch, appUtils} = useAppContext();
	const {toast} = appUtils;
	const location = useLocation();
	const {toastType} = (location.state as LocationState) || {};
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

	// Check any toast buffer
	useEffect(() => {
		if (toastType) {
			// state clears needs to be done manually
			navigate(location.pathname, {});
			if (toastType === ToastType.editRentSuccess) {
				if (!toast.isActive(ToastType.editRentSuccess)) {
					toast({
						id: ToastType.editRentSuccess,
						title: 'Edit successful',
						description: 'Rent details have updated successfully.',
						duration: 5000,
						isClosable: true,
						status: 'success'
					});
				}
			} else if (toastType === ToastType.editReturnSuccess) {
				if (!toast.isActive(ToastType.editReturnSuccess)) {
					toast({
						id: ToastType.editReturnSuccess,
						title: 'Edit successful',
						description: 'Return is pending for verification.',
						duration: 5000,
						isClosable: true,
						status: 'success'
					});
				}
			} else if (toastType === ToastType.reverifyReturnSuccess) {
				if (!toast.isActive(ToastType.reverifyReturnSuccess)) {
					toast({
						id: ToastType.reverifyReturnSuccess,
						title: 'Edit successful',
						description: 'Return is pending for re-verification.',
						duration: 5000,
						isClosable: true,
						status: 'success'
					});
				}
			}
		}
	}, [toastType]);

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
