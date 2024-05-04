import {AlertsData, DateRangeType, DateSubjectType, TableOrderBy} from '@/utils/const';
import moment from 'moment';
import {createContext, useState} from 'react';

const initialOrderBy = {
	dmz_id: undefined,
	dmz_name: undefined,
	area_name: undefined,
	nrr: undefined,
	status: undefined,
	timestamp: undefined
};

type StatusTab = 'all' | 'unread';

export type AlertsFilterHandlers = {
	handleSearchChange: (text: string) => void;
	handleDateChange: (dateSubject: DateSubjectType, date: Date) => void;
};

export const useAlertsPageContext = () => {
	// Table data states
	const [initData, setInitData] = useState<AlertsData[] | undefined>(undefined);
	const [filteredData, setFilteredData] = useState<AlertsData[] | undefined>(undefined);
	const [data, setData] = useState<AlertsData[] | undefined>(undefined);
	const selectedDataState = useState<AlertsData | undefined>(undefined);
	const [isFilterOrOrderLoading, setIsFilterOrOrderLoading] = useState(false);
	// Table column order states
	const [orderBy, setOrderBy] = useState<TableOrderBy>(initialOrderBy);
	const tableColumns = {
		dmz_id: 'DMZ ID',
		dmz_name: 'DMZ Name',
		area_name: 'Area Name',
		nrr: 'NRR',
		status: 'Status',
		timestamp: 'Date & Time'
	};
	// Table filter states
	const searchTextState = useState('');
	const statusState = useState<string | null>(null);
	const dateState = useState<DateRangeType>({
		from: new Date(),
		to: new Date()
	});
	const [statusTab, setStatusTab] = useState<StatusTab>('unread');
	const [, setSearchText] = searchTextState;
	const [, setStatus] = statusState;
	const [, setDate] = dateState;

	const refetch = async () => {
		const json = await fetch('https://hydrorise-sentinel-j5ag.onrender.com/alerts').then((res) => res.json());
		// Clean python response
		const jsonData = JSON.parse(json.alerts.replace(/nan/gi, 'null').replace(/None/g, 'null'));
		setInitData(jsonData);
		const unreadAlerts = jsonData.filter((alert: AlertsData) => alert.status == 'unread');
		if (statusTab == 'unread') {
			setData(unreadAlerts);
		} else {
			setData(jsonData);
		}
	};

	const handleStatusTabChange = (status: StatusTab) => {
		setIsFilterOrOrderLoading(true);
		if (status == 'all') {
			setStatusTab('all');
			setData(initData);
		} else {
			setStatusTab('unread');
			setData(initData?.filter((alert: AlertsData) => alert.status == 'unread'));
		}
		setIsFilterOrOrderLoading(false);
	};

	const handleDateChange = (date: DateRangeType) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const hasDataWithDate = prevData?.some(
				(alerts) => alerts.timestamp && new Date(alerts.timestamp) >= date.from
			);
			const filterResult = prevData?.filter(
				(alerts) =>
					alerts.timestamp &&
					new Date(alerts.timestamp) >= date.from &&
					// Add 1 day to include the selected date
					new Date(alerts.timestamp) <= moment(date.to).add(1, 'days').toDate()
			);
			const newFilterResult = initData?.filter(
				(alerts) =>
					alerts.timestamp &&
					new Date(alerts.timestamp) >= date.from &&
					// Add 1 day to include the selected date
					new Date(alerts.timestamp) <= moment(date.to).add(1, 'days').toDate()
			);
			const finalResult = hasDataWithDate ? filterResult : newFilterResult;
			setFilteredData(finalResult);
			return finalResult;
		});
		setIsFilterOrOrderLoading(false);
	};

	const handleStatusChange = (status: string) => {
		setIsFilterOrOrderLoading(true);
		setData((prev) => {
			const filterResult = prev?.filter((alert) => alert.status == status);
			setFilteredData(filterResult);
			return filterResult;
		});
		setIsFilterOrOrderLoading(false);
	};

	const handleSearchChange = (text: string) => {
		setIsFilterOrOrderLoading(true);
		const tabInitData =
			statusTab == 'unread' ? initData?.filter((alert) => alert.status == 'unread') : initData;
		if (!text) {
			setData(filteredData || tabInitData);
		}
		setData(
			(filteredData || tabInitData)?.filter((alerts) => {
				const lowercaseText = text.toLowerCase();
				return (
					alerts.dmz_id?.toString().toLowerCase().includes(lowercaseText) ||
					alerts.dmz_name?.toString().toLowerCase().includes(lowercaseText) ||
					alerts.area_name?.toString().toLowerCase().includes(lowercaseText) ||
					alerts.nrr?.toString().toLowerCase().includes(lowercaseText) ||
					alerts.status?.toString().toLowerCase().includes(lowercaseText)
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
			case tableColumns.area_name:
				setOrderBy((prev) => (prev.area_name == 'asc' ? {area_name: 'desc'} : {area_name: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.area_name == 'asc'
								? (a.area_name && b.area_name && b.area_name.localeCompare(a.area_name)) || -1
								: (a.area_name && b.area_name && a.area_name.localeCompare(b.area_name)) || -1
						)
				);
				break;
			case tableColumns.status:
				setOrderBy((prev) => (prev.status == 'asc' ? {status: 'desc'} : {status: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.status == 'asc'
								? (a.status && b.status && b.status.localeCompare(a.status)) || -1
								: (a.status && b.status && a.status.localeCompare(b.status)) || -1
						)
				);
				break;
			case tableColumns.timestamp:
				setOrderBy((prev) => (prev.timestamp == 'asc' ? {timestamp: 'desc'} : {timestamp: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.timestamp == 'asc'
								? (a.timestamp &&
										b.timestamp &&
										new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()) ||
								  -1
								: (a.timestamp &&
										b.timestamp &&
										new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()) ||
								  -1
						)
				);
				break;
			case tableColumns.nrr:
				setOrderBy((prev) => (prev.nrr == 'asc' ? {nrr: 'desc'} : {nrr: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.nrr == 'asc'
								? (a.nrr && b.nrr && (b.nrr as number) - (a.nrr as number)) || -1
								: (a.nrr && b.nrr && (a.nrr as number) - (b.nrr as number)) || -1
						)
				);
				break;
		}
		setIsFilterOrOrderLoading(false);
	};

	const handleClearData = () => {
		setFilteredData(undefined);
		setOrderBy(initialOrderBy);
		if (statusTab == 'unread') {
			setData(initData?.filter((alert: AlertsData) => alert.status == 'unread'));
		} else {
			setData(initData);
		}
	};

	const handleClearFilters = () => {
		setSearchText('');
		setStatus(null);
		setDate({from: new Date(), to: new Date()});
	};

	return {
		// Table data
		data,
		tableColumns,
		selectedDataState,
		statusTab,
		orderBy,
		isFilterOrOrderLoading,
		refetch,
		handleOrderBy,
		// Filter data
		searchTextState,
		statusState,
		dateState,
		handleDateChange,
		handleStatusChange,
		handleStatusTabChange,
		handleSearchChange,
		handleClearData,
		handleClearFilters
	};
};

export const AlertsPageContext = createContext<ReturnType<typeof useAlertsPageContext> | undefined>(
	undefined
);
