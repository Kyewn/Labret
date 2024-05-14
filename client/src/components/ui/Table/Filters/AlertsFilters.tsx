import {DatePicker} from '@/components/DatePicker/DatePicker';
import {AlertsData} from '@/utils/const';
import {AlertsPageContext, useAlertsPageContext} from '@/utils/context/AlertsPageContext';
import {
	Button,
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
import React, {useContext} from 'react';
import {BiChevronDown} from 'react-icons/bi';
import {FaSearch} from 'react-icons/fa';

export const AlertsFilters: React.FC = () => {
	const alertsPageContext = useContext(AlertsPageContext);
	const {
		data,
		searchTextState,
		dateState,
		statusState,
		statusTab,
		handleClearFilters,
		handleClearData,
		handleSearchChange,
		handleStatusChange,
		handleDateChange
	} = alertsPageContext as ReturnType<typeof useAlertsPageContext>;
	const [searchText, setSearchText] = searchTextState;
	const [date, setDate] = dateState;
	const [status, setStatus] = statusState;

	const statuses = (data as AlertsData[])
		.map((record) => record.status!)
		.filter((stat, i, arr) => stat && arr.indexOf(stat) === i);

	const onClear = () => {
		handleClearFilters();
		handleClearData();
	};

	return (
		<HStack width={'100%'} mt={3}>
			{/* Search bar */}
			<InputGroup width={'30%'} minWidth={'15em'}>
				<InputLeftElement>
					<FaSearch />
				</InputLeftElement>
				<Input
					value={searchText}
					placeholder='Search...'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSearchText(e.target.value);
						handleSearchChange(e.target.value);
					}}
				/>
			</InputGroup>
			{statusTab == 'all' && (
				<Menu>
					<MenuButton isDisabled={!statuses.length} as={Button} rightIcon={<BiChevronDown />}>
						{status || 'Status'}
					</MenuButton>
					<MenuList>
						{statuses.map(
							(stat) =>
								stat && (
									<MenuItem
										key={stat}
										onClick={() => {
											setStatus(stat);
											handleStatusChange(stat);
										}}
									>
										{`${stat[0].toUpperCase()}${stat.slice(1)}`}
									</MenuItem>
								)
						)}
					</MenuList>
				</Menu>
			)}
			{/* Date range picker */}
			<HStack ml={2}>
				<DatePicker
					date={date.from}
					onSelectedDateChanged={(date) => {
						setDate(() => {
							const dt = {from: date, to: date};
							handleDateChange(dt);
							return dt;
						});
					}}
				/>
				<Spacer />
				<DatePicker
					date={date.to}
					minDate={date.from}
					onSelectedDateChanged={(date) => {
						setDate((prev) => {
							const dt = {...prev, to: date};
							handleDateChange(dt);
							return dt;
						});
					}}
				/>
			</HStack>
			<Button variant={'secondary'} onClick={onClear}>
				Clear
			</Button>
		</HStack>
	);
};
