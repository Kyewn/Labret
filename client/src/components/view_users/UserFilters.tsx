import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {UserTableContext, useUsersTableContext} from '@/utils/context/UsersTableContext';
import {Button, HStack, Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import {SearchCheck} from 'lucide-react';
import {useContext} from 'react';
import {DateRange} from 'react-day-picker';

export const UserFilters: React.FC = () => {
	const userTableContext = useContext(UserTableContext);
	const {tableState, tableFiltersState, searchTextState, initialFilterState} =
		userTableContext as ReturnType<typeof useUsersTableContext>;
	const [table] = tableState;
	const [filters] = tableFiltersState;
	const [searchText] = searchTextState;

	const onClear = () => {
		table?.resetGlobalFilter();
		table?.setColumnFilters(initialFilterState);
	};

	return (
		<HStack width={'100%'} mt={3}>
			{/* Search bar */}
			<InputGroup width={'30%'} minWidth={'15em'}>
				<InputLeftElement>
					<SearchCheck />
				</InputLeftElement>
				<Input
					// Get 1 column as representative for other columns related to search bar
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
			<Button variant={'secondary'} onClick={onClear}>
				Clear
			</Button>
		</HStack>
	);
};
