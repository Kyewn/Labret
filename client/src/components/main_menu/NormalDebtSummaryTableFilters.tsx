import {useDebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {Button, Flex, HStack, Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import {Search} from 'lucide-react';

export const NormalDebtSummaryTableFilters: React.FC = () => {
	const {
		normalDebtTableState,
		searchTextState_normalDebtTable,
		initialSortingState_normalDebtSummaryTable
	} = useDebtTableContext() as ReturnType<typeof useInitialDebtTableContext>;
	const [table] = normalDebtTableState;
	const initialSortingValue = initialSortingState_normalDebtSummaryTable;
	const [searchText] = searchTextState_normalDebtTable;

	const onClear = () => {
		table?.resetGlobalFilter();
		table?.setSorting(initialSortingValue);
	};

	return (
		<Flex width={'100%'} marginY={3}>
			<HStack flex={1}>
				{/* Search bar */}
				<InputGroup height={'100%'} width={'30%'} minWidth={'15em'} alignItems={'center'}>
					<InputLeftElement top={'unset'} left={'unset'}>
						<Search />
					</InputLeftElement>
					<Input
						height={'100%'}
						value={searchText ?? ''}
						placeholder='Search...'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							table?.setGlobalFilter(e.target.value);
						}}
					/>
				</InputGroup>

				<Button variant={'outline'} onClick={onClear}>
					Clear
				</Button>
			</HStack>
		</Flex>
	);
};
