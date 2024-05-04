import axios from 'axios';

export const UndefinedString = 'None';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const swrFetcher = async (url: string): Promise<any> =>
	axios.get(url).then((res) => res.data);

export const formatDate = (date: Date) =>
	`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const formatDateAndTime = (date: Date) =>
	date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});
// API Data Structure
// Repairs
export type RepairsData = {
	id?: string;
	case_number?: string | number;
	dmz_id?: string;
	region?: string;
	location?: string;
	action_by?: string;
	status?: string;
	dt_opened?: string;
	dt_closed?: string;
	dt_wo_creation?: string;
	quick_comment?: string;
	subcategory?: string;
	subject?: string;
	description?: string;
	child_case_reason?: string;
	declined_reason?: string;
	other_declined_reasons?: string;
	cancelled_reason?: string;
	other_cancelled_reasons?: string;
	actual_problem?: string;
	case_resolution?: string;
};

// Sensor Log
export type SensorLogData = {
	dmz_id?: string;
	dmz_name?: string;
	dt?: Date | number;
	pressure_tp?: string | number;
	pressure_azp?: string | number;
	pressure_prv_upstream?: string | number;
	pressure_prv_downstream?: string | number;
	pressure_prv_upstream_2?: string | number;
	pressure_prv_downstream_2?: string | number;
	pressure_prv_upstream_3?: string | number;
	pressure_prv_downstream_3?: string | number;
	flow?: string | number;
};

// Alerts
export type AlertsData = {
	doc_id?: string;
	dmz_id?: string;
	dmz_name?: string;
	area_name?: string;
	description?: string;
	nrr?: string | number;
	status?: string;
	timestamp?: string | Date;
};

export type TableOrderBy = {
	[key: string]: 'asc' | 'desc' | undefined;
};

export type DateSubjectType = 'from' | 'to';
export type DateRangeType = {
	from: Date;
	to: Date;
};
