import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {
	useInitialVerificationTableContext,
	useVerificationTableContext
} from '@/utils/context/VerificationTableContext';
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

export const RentVerificationFilters: React.FC = () => {
	const {
		rentTableState,
		tableFiltersState_rentTable,
		searchTextState_rentTable,
		initialFilterValueState_rentTable,
		initialSortingState_rentTable,
		paginationState_rentTable
	} = useVerificationTableContext() as ReturnType<typeof useInitialVerificationTableContext>;
	const [table] = rentTableState;
	const [initialFilterValue] = initialFilterValueState_rentTable;
	const initialSortingValue = initialSortingState_rentTable;
	const [pagination] = paginationState_rentTable;
	const [filters] = tableFiltersState_rentTable;
	const [searchText] = searchTextState_rentTable;
	const createdAtFilterValue = useMemo(
		() => filters && (filters.find((f) => f.id === 'createdAt')?.value as DateRange),
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
					placeholder='Creation date'
					drValue={createdAtFilterValue}
					onSelectRange={(dateRange: DateRange) => {
						table?.setColumnFilters((prev) => {
							const {from, to} = dateRange;
							const otherFilters = prev.filter((f) => f.id !== 'createdAt');
							return from || to
								? [
										...otherFilters,
										{
											id: 'createdAt',
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