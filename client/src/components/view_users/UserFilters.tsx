import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {useInitialUserTableContext, useUserTableContext} from '@/utils/context/UsersTableContext';
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
import {useMemo} from 'react';
import {DateRange} from 'react-day-picker';

export const UserFilters: React.FC = () => {
	const {
		tableState,
		tableFiltersState,
		searchTextState,
		initialFilterValueState,
		initialSortingState,
		paginationState
	} = useUserTableContext() as ReturnType<typeof useInitialUserTableContext>;
	const [table] = tableState;
	const [pagination] = paginationState;
	const [filters] = tableFiltersState;
	const [searchText] = searchTextState;
	const [initialFilterValue] = initialFilterValueState;
	const dateFilterValue = useMemo(
		() => filters.find((f) => f.id === 'createdAt')?.value as DateRange,
		[filters]
	);

	const onClear = () => {
		table?.resetGlobalFilter();
		table?.setColumnFilters(initialFilterValue);
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
					drValue={dateFilterValue}
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
