import {useDebtTableContext, useInitialDebtTableContext} from '@/utils/context/DebtTableContext';
import {
	Button,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spacer
} from '@chakra-ui/react';
import {ChevronDown, Search} from 'lucide-react';

export const NormalDebtTableFilters: React.FC = () => {
	const {
		normalDebtTableState,
		searchTextState_normalDebtTable,
		initialFilterValueState_normalDebtTable,
		initialSortingState_normalDebtTable,
		paginationState_normalDebtTable
	} = useDebtTableContext() as ReturnType<typeof useInitialDebtTableContext>;
	const [table] = normalDebtTableState;
	const [initialFilterValue] = initialFilterValueState_normalDebtTable;
	const initialSortingValue = initialSortingState_normalDebtTable;
	const [pagination] = paginationState_normalDebtTable;
	const [searchText] = searchTextState_normalDebtTable;

	const onClear = () => {
		table?.resetGlobalFilter();
		table?.setColumnFilters(initialFilterValue);
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
			<Spacer flex={0.1} />
			<Menu>
				<MenuButton as={Button} rightIcon={<ChevronDown />} variant={'outline'} fontSize={'sm'}>
					Limit records: {pagination?.pageSize}
				</MenuButton>
				<MenuList>
					<MenuItem onClick={() => table?.setPageSize(10)}>10</MenuItem>
					<MenuItem onClick={() => table?.setPageSize(50)}>50</MenuItem>
					<MenuItem onClick={() => table?.setPageSize(100)}>100</MenuItem>
				</MenuList>
			</Menu>
		</Flex>
	);
};
