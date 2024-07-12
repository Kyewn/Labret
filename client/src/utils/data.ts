export const UndefinedString = 'None';

// App form types
// CreateUpdate forms
export type AddUserFormValues = {
	name: string;
	email: string;
};

export type NewRentingItemFormValues = {
	item?: Item;
	rentQuantity?: string | number;
};
export type NewRentFormValues = {
	recordTitle?: string;
	recordNotes?: string;
	recordReturnDate?: Date;
	isReadTnC?: boolean;
};

// Table record info
export type UserInfoValues = {
	name?: string;
	email?: string;
	createdAt?: string | Date;
};
export type RecordInfoValues = {
	title?: string;
	email?: string;
	createdAt?: string | Date;
};
// DB Data Structure
// User
export type User = {
	id: string;
	name: string;
	email: string;
	status: string;
	type: string;
	createdAt: string | Date;
	imageUrls: string[];
	lastRentalAt?: string | Date;
	createdBy?: string | User;
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
	itemImages: string[];
	itemQuantity: string | number;
	itemCategory?: string;
	itemDescription?: string;
	createdAt?: string | Date;
	createdBy?: string;
};

export type RentingItem = {
	item: string | Item;
	rentQuantity: string | number;
	proofOfReturn?: string | Blob;
};

export type RentalRecord = {
	renterId: string | number;
	recordId: string;
	recordTitle: string;
	notes?: string;
	recordStatus: string;
	rentingItems: RentingItem[];
	rentImages: string[];
	rentedAt: string | Date;
	expectedReturnAt: string | Date;
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

export type FormValues =
	| AddUserFormValues
	| UserInfoValues
	| NewRentingItemFormValues
	| NewRentFormValues;
export type FormKeys =
	| keyof AddUserFormValues
	| keyof UserInfoValues
	| keyof NewRentingItemFormValues
	| keyof NewRentFormValues;
export type TableData = User | RentalRecord | Item | Verification;

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

export const mapRecordStatus = (status: string) => {
	switch (status) {
		case 'pending':
			return 'Pending';

		case 'active':
			return 'Active';

		case 'returning':
			return 'Returning';

		case 'rent_reverifying':
		case 'return_reverifying':
			return 'Reverifying';

		case 'completed':
			return 'Completed';

		case 'rent_rejected':
		case 'return_rejected':
			return 'Rejected';

		default:
			return status;
	}
};
