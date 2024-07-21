import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {
	useInitialItemAvailabilityTableContext,
	useItemAvailabilityTableContext
} from '@/utils/context/ItemAvailabilityTableContext';
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

export const AvailabilityTableFilters: React.FC = () => {
	const {
		availabilityTableState,
		tableFiltersState_availabilityTable,
		searchTextState_availabilityTable,
		initialFilterValueState_availabilityTable,
		initialSortingState_availabilityTable,
		paginationState_availabilityTable
	} = useItemAvailabilityTableContext() as ReturnType<
		typeof useInitialItemAvailabilityTableContext
	>;
	const [table] = availabilityTableState;
	const [initialFilterValue] = initialFilterValueState_availabilityTable;
	const initialSortingValue = initialSortingState_availabilityTable;
	const [pagination] = paginationState_availabilityTable;
	const [filters] = tableFiltersState_availabilityTable;
	const [searchText] = searchTextState_availabilityTable;
	const earliestReturnDateFilterValue = useMemo(
		() => filters && (filters.find((f) => f.id === 'earliestReturnBy')?.value as DateRange),
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
					placeholder='Earliest return by'
					drValue={earliestReturnDateFilterValue}
					onSelectRange={(dateRange: DateRange) => {
						table?.setColumnFilters((prev) => {
							const {from, to} = dateRange;
							const otherFilters = prev.filter((f) => f.id !== 'earliestReturnBy');
							return from || to
								? [
										...otherFilters,
										{
											id: 'earliestReturnBy',
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
