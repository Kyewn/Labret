import {AvailabilityTable} from '@/components/item_availability/AvailabilityTable';
import {ItemAvailabilityItemModal} from '@/components/item_availability/ItemAvailabilityItemModal';
import {useAppContext} from '@/utils/context/AppContext';
import {
	ItemAvailabilityTableContext,
	useInitialItemAvailabilityTableContext
} from '@/utils/context/ItemAvailabilityTableContext';
import {Divider, Flex, Heading, HStack} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';

export function ItemAvailability() {
	const {appDispatch} = useAppContext();
	const itemAvailabilityTableContext = useInitialItemAvailabilityTableContext() as ReturnType<
		typeof useInitialItemAvailabilityTableContext
	>;
	const {initDataState, refetch, infoDisclosure} = itemAvailabilityTableContext;
	const [initData] = initDataState;

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

	return (
		<>
			<Helmet>
				<title>Item Availability</title>
			</Helmet>
			<ItemAvailabilityTableContext.Provider value={itemAvailabilityTableContext}>
				<ItemAvailabilityItemModal disclosure={infoDisclosure} />

				<Flex flex={1} flexDirection={'column'} justifyContent={'center'} p={3} paddingX={10}>
					<HStack spacing={10}>
						<Flex marginY={3} alignItems={'center'}>
							<Heading size={'md'}>Item Availability</Heading>
						</Flex>
					</HStack>
					<Divider orientation='horizontal' />
					<AvailabilityTable />
				</Flex>
			</ItemAvailabilityTableContext.Provider>
		</>
	);
}
