export const UndefinedString = 'None';

// App form types
// CreateUpdate forms
export type AddUserFormValues = {
	name: string;
	email: string;
};

export type NewRentingItemFormValues = {
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
	itemQuantity: string | number;
	itemCategory?: string;
	itemDescription?: string;
	createdAt?: string | Date;
	createdBy?: string;
};

export type RentingItem = {
	item: Item;
	rentQuantity: string | number;
	proofOfReturn?: string | Blob;
};

export type RentalRecord = {
	recordId: string;
	recordTitle: string;
	renterId: string | number;
	rentingItems: RentingItem[];
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
	recordId: string; // Rental record id
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

export type FormValues = AddUserFormValues | UserInfoValues | NewRentingItemFormValues;
export type FormKeys =
	| keyof AddUserFormValues
	| keyof UserInfoValues
	| keyof NewRentingItemFormValues;
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
