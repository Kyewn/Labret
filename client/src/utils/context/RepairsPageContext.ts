import {DateRangeType, DateSubjectType, RepairsData, TableOrderBy} from '@/utils/const';
import moment from 'moment';
import {createContext, useState} from 'react';

const initialOrderBy = {
	case_number: undefined,
	dmz_id: undefined,
	region: undefined,
	location: undefined,
	action_by: undefined,
	status: undefined,
	dt_opened: undefined,
	dt_closed: undefined,
	subcategory: undefined
};

export type RepairsFilterHandlers = {
	handleSearchChange: (text: string) => void;
	handleCategoryChange: (category?: string) => void;
	handleActionByChange: (actionBy?: string) => void;
	handleStatusChange: (status?: string) => void;
	handleRegionChange: (region?: string) => void;
	handleOpenDateChange: (dateSubject: DateSubjectType, date: Date) => void;
	handleCloseDateChange: (dateSubject: DateSubjectType, date: Date) => void;
};

export const useRepairsPageContext = () => {
	// Table data states
	const [initData, setInitData] = useState<RepairsData[] | undefined>(undefined);
	const [filteredData, setFilteredData] = useState<RepairsData[] | undefined>(undefined);
	const [data, setData] = useState<RepairsData[] | undefined>(undefined);
	const selectedDataState = useState<RepairsData | undefined>(undefined);
	// Table column order states
	const [orderBy, setOrderBy] = useState<TableOrderBy>(initialOrderBy);
	const [isFilterOrOrderLoading, setIsFilterOrOrderLoading] = useState(false);
	const tableColumns = {
		case_number: 'Case Number',
		dmz_id: 'DMZ ID',
		region: 'Region',
		location: 'Location',
		action_by: 'Action By',
		status: 'Status',
		dt_opened: 'Date/Time Opened',
		dt_closed: 'Date/Time Closed',
		subcategory: 'Sub Category'
	};
	// Table filter states
	const searchTextState = useState('');
	const categoryState = useState<string | null>(null);
	const statusState = useState<string | null>(null);
	const regionState = useState<string | null>(null);
	const actionByState = useState<string | null>(null);
	const openDateState = useState<DateRangeType>({
		from: new Date(),
		to: new Date()
	});
	const closeDateState = useState<DateRangeType>({
		from: new Date(),
		to: new Date()
	});
	const [, setSearchText] = searchTextState;
	const [, setCategory] = categoryState;
	const [, setStatus] = statusState;
	const [, setRegion] = regionState;
	const [, setOpenDate] = openDateState;
	const [, setCloseDate] = closeDateState;
	const [, setActionBy] = actionByState;

	const refetch = async () => {
		const json = await fetch('https://hydrorise-sentinel-j5ag.onrender.com/repairs').then((res) => {
			return res.json();
		});
		// Clean python response
		const jsonData = JSON.parse(json.data.replace(/nan/gi, 'null').replace(/None/g, 'null'));
		setInitData(jsonData);
		setData(jsonData);
	};

	const handleCategoryChange = (category?: string) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const filterResult = prevData?.filter((repair) => repair.subcategory == category);
			setFilteredData(filterResult);
			return filterResult;
		});
		setIsFilterOrOrderLoading(false);
	};
	const handleStatusChange = (status?: string) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const filterResult = prevData?.filter((repair) => repair.status == status);
			setFilteredData(filterResult);
			return filterResult;
		});
		setIsFilterOrOrderLoading(false);
	};
	const handleRegionChange = (region?: string) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const filterResult = prevData?.filter((repair) => repair.region == region);
			setFilteredData(filterResult);
			return filterResult;
		});
		setIsFilterOrOrderLoading(false);
	};
	const handleActionByChange = (ab?: string) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const filterResult = prevData?.filter((repair) => repair.action_by == ab);
			setFilteredData(filterResult);
			return filterResult;
		});
		setIsFilterOrOrderLoading(false);
	};
	const handleOpenDateChange = (date: DateRangeType) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const hasDataWithDate = prevData?.some(
				(repair) => repair.dt_opened && new Date(repair.dt_opened) >= date.from
			);
			const filterResult = prevData?.filter(
				(repair) =>
					repair.dt_opened &&
					new Date(repair.dt_opened) >= date.from &&
					// Add 1 day to include the selected date
					new Date(repair.dt_opened) <= moment(date.to).add(1, 'days').toDate()
			);
			const newFilterResult = initData?.filter(
				(repair) =>
					repair.dt_opened &&
					new Date(repair.dt_opened) >= date.from &&
					// Add 1 day to include the selected date
					new Date(repair.dt_opened) <= moment(date.to).add(1, 'days').toDate()
			);
			const finalResult = hasDataWithDate ? filterResult : newFilterResult;
			setFilteredData(finalResult);
			return finalResult;
		});
		setIsFilterOrOrderLoading(false);
	};

	const handleCloseDateChange = (date: DateRangeType) => {
		setIsFilterOrOrderLoading(true);
		setData((prevData) => {
			const hasDataWithDate = prevData?.some(
				(repair) => repair.dt_closed && new Date(repair.dt_closed) >= date.from
			);
			const filterResult = prevData?.filter((repair) => {
				return (
					repair.dt_closed &&
					new Date(repair.dt_closed) >= date.from &&
					// Add 1 day to include the selected date
					new Date(repair.dt_closed) <= moment(date.to).add(1, 'days').toDate()
				);
			});
			const newFilterResult = initData?.filter(
				(repair) =>
					repair.dt_closed &&
					new Date(repair.dt_closed) >= date.from &&
					// Add 1 day to include the selected date
					new Date(repair.dt_closed) <= moment(date.to).add(1, 'days').toDate()
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
			(filteredData || initData)?.filter((repair) => {
				const lowercaseText = text.toLowerCase();
				return (
					repair.case_number?.toString().includes(lowercaseText) ||
					repair.dmz_id?.toLowerCase().includes(lowercaseText) ||
					repair.location?.toLowerCase().includes(lowercaseText)
				);
			})
		);
		setIsFilterOrOrderLoading(false);
	};

	const handleOrderBy = (column: string) => {
		setIsFilterOrOrderLoading(true);
		switch (column) {
			case 'Case Number':
				setOrderBy((prev) =>
					prev.case_number == 'asc' ? {case_number: 'desc'} : {case_number: 'asc'}
				);
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.case_number == 'asc'
								? (a.case_number &&
										b.case_number &&
										(b.case_number as number) - (a.case_number as number)) ||
								  0
								: (a.case_number &&
										b.case_number &&
										(a.case_number as number) - (b.case_number as number)) ||
								  0
						)
				);
				break;
			case 'DMZ ID':
				setOrderBy((prev) => (prev.dmz_id == 'asc' ? {dmz_id: 'desc'} : {dmz_id: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dmz_id == 'asc'
								? (a.dmz_id && b.dmz_id && b.dmz_id.localeCompare(a.dmz_id)) || 0
								: (a.dmz_id && b.dmz_id && a.dmz_id.localeCompare(b.dmz_id)) || 0
						)
				);
				break;
			case 'Region':
				setOrderBy((prev) => (prev.region == 'asc' ? {region: 'desc'} : {region: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.region == 'asc'
								? (a.region && b.region && b.region.localeCompare(a.region)) || 0
								: (a.region && b.region && a.region.localeCompare(b.region)) || 0
						)
				);
				break;
			case 'Location':
				setOrderBy((prev) => (prev.location == 'asc' ? {location: 'desc'} : {location: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.location == 'asc'
								? (a.location && b.location && b.location.localeCompare(a.location)) || 0
								: (a.location && b.location && a.location.localeCompare(b.location)) || 0
						)
				);
				break;
			case 'Action By':
				setOrderBy((prev) => (prev.action_by == 'asc' ? {action_by: 'desc'} : {action_by: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.action_by == 'asc'
								? (a.action_by && b.action_by && b.action_by.localeCompare(a.action_by)) || 0
								: (a.action_by && b.action_by && a.action_by.localeCompare(b.action_by)) || 0
						)
				);
				break;
			case 'Status':
				setOrderBy((prev) => (prev.status == 'asc' ? {status: 'desc'} : {status: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.status == 'asc'
								? (a.status && b.status && b.status.localeCompare(a.status)) || 0
								: (a.status && b.status && a.status.localeCompare(b.status)) || 0
						)
				);
				break;
			case 'Date/Time Opened':
				setOrderBy((prev) => (prev.dt_opened == 'asc' ? {dt_opened: 'desc'} : {dt_opened: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dt_opened == 'asc'
								? (a.dt_opened &&
										b.dt_opened &&
										new Date(b.dt_opened).valueOf() - new Date(a.dt_opened).valueOf()) ||
								  0
								: (a.dt_opened &&
										b.dt_opened &&
										new Date(a.dt_opened).valueOf() - new Date(b.dt_opened).valueOf()) ||
								  0
						)
				);
				break;
			case 'Date/Time Closed':
				setOrderBy((prev) => (prev.dt_closed == 'asc' ? {dt_closed: 'desc'} : {dt_closed: 'asc'}));
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.dt_closed == 'asc'
								? (a.dt_closed &&
										b.dt_closed &&
										new Date(b.dt_closed).valueOf() - new Date(a.dt_closed).valueOf()) ||
								  0
								: (a.dt_closed &&
										b.dt_closed &&
										new Date(a.dt_closed).valueOf() - new Date(b.dt_closed).valueOf()) ||
								  0
						)
				);
				break;
			case 'Sub Category':
				setOrderBy((prev) =>
					prev.subcategory == 'asc' ? {subcategory: 'desc'} : {subcategory: 'asc'}
				);
				setData((prevData) =>
					prevData
						?.slice()
						.sort((a, b) =>
							orderBy.subcategory == 'asc'
								? (a.subcategory && b.subcategory && b.subcategory.localeCompare(a.subcategory)) ||
								  0
								: (a.subcategory && b.subcategory && a.subcategory.localeCompare(b.subcategory)) ||
								  0
						)
				);
				break;
		}
		setIsFilterOrOrderLoading(false);
	};

	const handleClearData = () => {
		setFilteredData(undefined);
		setOrderBy({
			case_number: undefined,
			dmz_id: undefined,
			region: undefined,
			location: undefined,
			action_by: undefined,
			status: undefined,
			dt_opened: undefined,
			dt_closed: undefined,
			subcategory: undefined
		});
		setData(initData);
	};

	const handleClearFilters = () => {
		setSearchText('');
		setStatus(null);
		setCategory(null);
		setRegion(null);
		setActionBy(null);
		setOpenDate({from: new Date(), to: new Date()});
		setCloseDate({from: new Date(), to: new Date()});
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
		// Filter Data
		searchTextState,
		categoryState,
		statusState,
		regionState,
		actionByState,
		openDateState,
		closeDateState,
		// Filter Handlers
		handleCategoryChange,
		handleStatusChange,
		handleRegionChange,
		handleActionByChange,
		handleOpenDateChange,
		handleCloseDateChange,
		handleSearchChange,
		handleClearData,
		handleClearFilters
	};
};

export const RepairsPageContext = createContext<
	ReturnType<typeof useRepairsPageContext> | undefined
>(undefined);
