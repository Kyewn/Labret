import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {
	useInitialUserHistoryTableContext,
	useUserHistoryTableContext
} from '@/utils/context/UserHistoryTableContext';
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

export const UserHistoryRejectedFilters: React.FC = () => {
	const {
		rejectedTableState,
		tableFiltersState_rejectedTable,
		searchTextState_rejectedTable,
		initialFilterValueState_rejectedTable,
		initialSortingState_rejectedTable,
		paginationState_rejectedTable
	} = useUserHistoryTableContext() as ReturnType<typeof useInitialUserHistoryTableContext>;
	const [table] = rejectedTableState;
	const [initialFilterValue] = initialFilterValueState_rejectedTable;
	const initialSortingValue = initialSortingState_rejectedTable;
	const [pagination] = paginationState_rejectedTable;
	const [filters] = tableFiltersState_rejectedTable;
	const [searchText] = searchTextState_rejectedTable;
	const rentDateFilterValue = useMemo(
		() => filters && (filters.find((f) => f.id === 'rentedAt')?.value as DateRange),
		[filters]
	);
	const expectedReturnDateFilterValue = useMemo(
		() => filters && (filters.find((f) => f.id === 'expectedReturnAt')?.value as DateRange),
		[filters]
	);

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
				<DatePickerWithRange
					placeholder='Rent date'
					drValue={rentDateFilterValue}
					onSelectRange={(dateRange: DateRange) => {
						table?.setColumnFilters((prev) => {
							const {from, to} = dateRange;
							const otherFilters = prev.filter((f) => f.id !== 'rentedAt');
							return from || to
								? [
										...otherFilters,
										{
											id: 'rentedAt',
											value: dateRange
										}
								  ]
								: [...otherFilters];
						});
					}}
				/>
				<DatePickerWithRange
					placeholder='Expected return'
					drValue={expectedReturnDateFilterValue}
					onSelectRange={(dateRange: DateRange) => {
						table?.setColumnFilters((prev) => {
							const {from, to} = dateRange;
							const otherFilters = prev.filter((f) => f.id !== 'expectedReturnAt');

							return from || to
								? [
										...otherFilters,
										{
											id: 'expectedReturnAt',
											value: dateRange
										}
								  ]
								: [...otherFilters];
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
