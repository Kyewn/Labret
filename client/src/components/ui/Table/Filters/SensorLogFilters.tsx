import {DatePicker} from '@/components/DatePicker/DatePicker';
import {SensorLogPageContext, useSensorLogPageContext} from '@/utils/context/SensorLogPageContext';
import {Button, HStack, Input, InputGroup, InputLeftElement, Spacer} from '@chakra-ui/react';
import React, {useContext} from 'react';
import {FaSearch} from 'react-icons/fa';

export const SensorLogFilters: React.FC = () => {
	const sensorLogPageContext = useContext(SensorLogPageContext);
	const {
		searchTextState,
		dateState,
		handleClearFilters,
		handleClearData,
		handleSearchChange,
		handleDateChange
	} = sensorLogPageContext as ReturnType<typeof useSensorLogPageContext>;
	const [searchText, setSearchText] = searchTextState;
	const [date, setDate] = dateState;

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
