import {RegisterFormVal2, RegisterFormValues} from '@/utils/context/RegisterContext';

export const UndefinedString = 'None';

// React hook form general types
export type FormValues = RegisterFormValues | RegisterFormVal2;
export type FormKeys = keyof RegisterFormValues | keyof RegisterFormVal2;

// DB Data Structure
// User
export type User = {
	id: string | number;
	name: string;
	email: string;
	status: string;
	type: string;
	createdAt: string | Date;
	lastRentalAt?: null;
};

// export type TableOrderBy = {
// 	[key: string]: 'asc' | 'desc' | undefined;
// };

// export type DateSubjectType = 'from' | 'to';
// export type DateRangeType = {
// 	from: Date;
// 	to: Date;
// };
