export const UndefinedString = 'None';

// React hook form general types
export type AddUserFormValues = {
	name: string;
	email: string;
};
export type UserInfoValues = {
	name?: string;
	email?: string;
	createdAt?: string | Date;
};

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

// Data Utils
// User
export const mapUserStatus = (status: string) => {
	switch (status) {
		case 'active':
			return 'Active';
		case 'pending':
			return 'Pending';
		default:
			return status;
	}
};

export type FormValues = AddUserFormValues | UserInfoValues;
export type FormKeys = keyof AddUserFormValues | keyof UserInfoValues;
export type TableData = User;
