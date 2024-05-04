import {DateRangeType, DateSubjectType, SensorLogData, TableOrderBy} from '@/utils/const';
import moment from 'moment';
import {createContext, useState} from 'react';

const initialOrderBy = {
	dmz_id: undefined,
	dmz_name: undefined,
	dt: undefined,
	pressure_tp: undefined,
	pressure_azp: undefined,
	pressure_prv_upstream: undefined,
	pressure_prv_downstream: undefined,
	pressure_prv_upstream_2: undefined,
	pressure_prv_downstream_2: undefined,
	pressure_prv_upstream_3: undefined,
	pressure_prv_downstream_3: undefined,
	flow: undefined
};

export type SensorLogFilterHandlers = {
	handleSearchChange: (text: string) => void;
	handleDateChange: (dateSubject: DateSubjectType, date: Date) => void;
};

export const useSensorLogPageContext = () => {
	// Table data states
	const [initData, setInitData] = useState<SensorLogData[] | undefined>(undefined);
	const [filteredData, setFilteredData] = useState<SensorLogData[] | undefined>(undefined);
	const [data, setData] = useState<SensorLogData[] | undefined>(undefined);
	const selectedDataState = useState<SensorLogData | undefined>(undefined);
	const [isFilterOrOrderLoading, setIsFilterOrOrderLoading] = useState(false);
	// Table column order states
	const [orderBy, setOrderBy] = useState<TableOrderBy>(initialOrderBy);
	const tableColumns = {
		dmz_id: 'DMZ ID',
		dmz_name: 'DMZ Name',
		dt: 'Date',
		pressure_tp: 'Pressure TP',
		pressure_azp: 'Pressure AZP',
		flow: 'Flow'
	};
	// Table filter states
	const searchTextState = useState('');
	const dateState = useState<DateRangeType>({
		from: new Date(),
		to: new Date()
	});
	const [, setSearchText] = searchTextState;
	const [, setDate] = dateState;
	const refetch = async () => {
		const json = await fetch('https://hydrorise-sentinel-j5ag.onrender.com/hydraulics').then((res) => res.json());
		// Clean python response
		const jsonData = Object.values(json).map((data) =>
			JSON.parse(
				JSON.stringify(data).replace(/nan/gi, 'null').replace(/None/g, 'null').replace(/'/g, '"')
			)
		);
		setInitData(jsonData);
		setData(jsonData);
	};

	const handleDateChange = (date: DateRangeType) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const hasDataWithDate = prevData?.some(
				(sensorLog) => sensorLog.dt && new Date(sensorLog.dt) >= date.from
			);
			const filterResult = prevData?.filter(
				(sensorLog) =>
					sensorLog.dt &&
					new Date(sensorLog.dt) >= date.from &&
					// Add 1 day to include the selected date
					new Date(sensorLog.dt) <= moment(date.to).add(1, 'days').toDate()
			);
			const newFilterResult = initData?.filter(
				(sensorLog) =>
					sensorLog.dt &&
					new Date(sensorLog.dt) >= date.from &&
					// Add 1 day to include the selected date
					new Date(sensorLog.dt) <= moment(date.to).add(1, 'days').toDate()
			);
			const finalResult = hasDataWithDate ? filterResult : newFilterResult;
			setFilteredData(finalResult);
			return finalResult;
		});
		setIsFilterOrOrderLoading(false);
	};

	const handleSearchChange = (text: string) => {
		setIsFilterOrOrderLoading(true);
		if (!text) {
			setData(filteredData || initData);
		}
		setData(
			(filteredData || initData)?.filter((sensorLog) => {
				const lowercaseText = text.toLowerCase();
				return (
					sensorLog.dmz_id?.toString().toLowerCase().includes(lowercaseText) ||
					sensorLog.dmz_name?.toString().toLowerCase().includes(lowercaseText) ||
					sensorLog.pressure_tp?.toString().toLowerCase().includes(lowercaseText) ||
					sensorLog.pressure_azp?.toString().toLowerCase().includes(lowercaseText) ||
					sensorLog.flow?.toString().toLowerCase().includes(lowercaseText)
				);
			})
		);
		setIsFilterOrOrderLoading(false);
	};

	const handleOrderBy = (column: string) => {
		setIsFilterOrOrderLoading(true);
		switch (column) {
			case tableColumns.dmz_id:
				setOrderBy((prev) => (prev.dmz_id == 'asc' ? {dmz_id: 'desc'} : {dmz_id: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dmz_id == 'asc'
								? (a.dmz_id && b.dmz_id && b.dmz_id.localeCompare(a.dmz_id)) || -1
								: (a.dmz_id && b.dmz_id && a.dmz_id.localeCompare(b.dmz_id)) || -1
						)
				);
				break;
			case tableColumns.dmz_name:
				setOrderBy((prev) => (prev.dmz_name == 'asc' ? {dmz_name: 'desc'} : {dmz_name: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dmz_name == 'asc'
								? (a.dmz_name && b.dmz_name && b.dmz_name.localeCompare(a.dmz_name)) || -1
								: (a.dmz_name && b.dmz_name && a.dmz_name.localeCompare(b.dmz_name)) || -1
						)
				);
				break;
			case tableColumns.dt:
				setOrderBy((prev) => (prev.dt == 'asc' ? {dt: 'desc'} : {dt: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dt == 'asc'
								? (a.dt && b.dt && new Date(b.dt).valueOf() - new Date(a.dt).valueOf()) || -1
								: (a.dt && b.dt && new Date(a.dt).valueOf() - new Date(b.dt).valueOf()) || -1
						)
				);
				break;
			case tableColumns.pressure_tp:
				setOrderBy((prev) =>
					prev.pressure_tp == 'asc' ? {pressure_tp: 'desc'} : {pressure_tp: 'asc'}
				);
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.pressure_tp == 'asc'
								? (a.pressure_tp &&
										b.pressure_tp &&
										(b.pressure_tp as number) - (a.pressure_tp as number)) ||
								  -1
								: (a.pressure_tp &&
										b.pressure_tp &&
										(a.pressure_tp as number) - (b.pressure_tp as number)) ||
								  -1
						)
				);
				break;
			case tableColumns.pressure_azp:
				setOrderBy((prev) =>
					prev.pressure_azp == 'asc' ? {pressure_azp: 'desc'} : {pressure_azp: 'asc'}
				);
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.pressure_azp == 'asc'
								? (a.pressure_azp &&
										b.pressure_azp &&
										(b.pressure_azp as number) - (a.pressure_azp as number)) ||
								  -1
								: (a.pressure_azp &&
										b.pressure_azp &&
										(a.pressure_azp as number) - (b.pressure_azp as number)) ||
								  -1
						)
				);
				break;
			case tableColumns.flow:
				setOrderBy((prev) => (prev.flow == 'asc' ? {flow: 'desc'} : {flow: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.flow == 'asc'
								? (a.flow && b.flow && (b.flow as number) - (a.flow as number)) || -1
								: (a.flow && b.flow && (a.flow as number) - (b.flow as number)) || -1
						)
				);
				break;
		}
		setIsFilterOrOrderLoading(false);
	};

	const handleClearData = () => {
		setFilteredData(undefined);
		setOrderBy(initialOrderBy);
		setData(initData);
	};

	const handleClearFilters = () => {
		setSearchText('');
		setDate({from: new Date(), to: new Date()});
	};

	return {
		// Table data
		data,
		tableColumns,
		selectedDataState,
		orderBy,
		isFilterOrOrderLoading,
		refetch,
		handleOrderBy,
		// Filter data
		searchTextState,
		dateState,
		handleDateChange,
		handleSearchChange,
		handleClearData,
		handleClearFilters
	};
};

export const SensorLogPageContext = createContext<
	ReturnType<typeof useSensorLogPageContext> | undefined
>(undefined);
