import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {UserTableContext, useUserTableContext} from '@/utils/context/UsersTableContext';
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
import {useContext} from 'react';
import {DateRange} from 'react-day-picker';

export const UserFilters: React.FC = () => {
	const userTableContext = useContext(UserTableContext);
	const {
		tableState,
		tableFiltersState,
		searchTextState,
		initialFilterState,
		initialSortingState,
		paginationState
	} = userTableContext as ReturnType<typeof useUserTableContext>;
	const [table] = tableState;
	const [pagination] = paginationState;
	const [filters] = tableFiltersState;
	const [searchText] = searchTextState;

	const onClear = () => {
		table?.resetGlobalFilter();
		table?.setColumnFilters(initialFilterState);
		table?.setSorting(initialSortingState);
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
				<DatePickerWithRange
					drValue={filters.find((f) => f.id === 'createdAt')?.value as DateRange}
					onSelectRange={(dateRange: DateRange) => {
						table?.setColumnFilters((prev) => {
							const otherFilters = prev.filter((f) => f.id !== 'createdAt');
							return [
								...otherFilters,
								{
									id: 'createdAt',
									value: dateRange
								}
							];
						});
					}}
				/>
				<Button variant={'outline'} onClick={onClear}>
					Clear
				</Button>
			</HStack>
			<Spacer flex={0.1} />
			<Menu>
				<MenuButton as={Button} rightIcon={<ChevronDown />} variant={'outline'} fontSize={'sm'}>
					Limit records: {pagination.pageSize}
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
