export const UndefinedString = 'None';

// App form types
// CreateUpdate forms
export type AddUserFormValues = {
	name: string;
	email: string;
};

export type NewRentedItemFormValues = {
	item?: Item;
	rentQuantity?: number;
};

// Table record info
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
	imageUrls: string[];
	lastRentalAt?: string | Date;
};

export type UserEditableFields = {
	name?: string;
	email?: string;
	status?: string;
	type?: string;
	createdAt?: string | Date;
	imageUrls?: string[];
	lastRentalAt?: string | Date;
};

export type Item = {
	itemId: string;
	itemName: string;
	itemImages: string;
	itemQuantity?: string | number; // Referenced by rented item and should be opt in
	itemCategory?: string;
	itemDescription?: string;
	createdAt?: string | Date;
	createdBy?: string;
};

export type RentedItem = {
	item: Item;
	rentQuantity: string | number;
	proofOfReturn?: string;
};

export type RentalRecord = {
	recordId: string;
	recordTitle: string;
	renterId: string | number;
	rentedItems: RentedItem[];
	rentImages: string[];
	notes: string;
	rentStatus: string;
	rentedAt: string | Date;
	returnedAt?: string | Date;
	returnImages?: Record<string, unknown>[];
	returnLocation?: string;
};

export type Verification = {
	verificationId: string;
	rentId: string;
	verificationType: string;
	verificationStatus: string;
	createdAt: string | Date;
	verifiedAt?: string | Date;
	verifiedBy?: string;
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

export type FormValues = AddUserFormValues | UserInfoValues | NewRentedItemFormValues;
export type FormKeys =
	| keyof AddUserFormValues
	| keyof UserInfoValues
	| keyof NewRentedItemFormValues;
export type TableData = User;

// Others
export type MiscObject = {
	[key: string]: string | number | boolean | Date;
};
export type InputData = TableData | MiscObject;

// Prediction API
export type FaceResult = {
	labels: string[];
	scores: number[];
};
