import {FieldValue} from 'firebase/firestore';

export const UndefinedString = 'None';

// App form types
// CreateUpdate forms
export type AddUserFormValues = {
	name: string;
	email: string;
};

export type AddItemFormValues = {
	itemName: string;
	itemQuantity: string | number; // Total quantity
	itemDescription?: string;
	itemCategory?: string;
};
export type AddRecordFormValues = {
	expectedReturnAt: string;
	recordTitle: string;
	recordNotes?: string;
	rentingItems: RentingItem[];
	rentImages: string[];
};
export type NewRentingItemFormValues = {
	item?: Item;
	rentQuantity?: string | number;
};
export type NewRentFormValues = {
	recordTitle: string;
	recordNotes?: string;
	expectedReturnAt: Date;
	isReadTnC?: boolean;
};

export type ReturnFormValues = {
	rentingItemsWithImageProof: RentingItem[];
	returnLocation: string;
	returnNotes?: string;
};

export type EditRentalRecordFormValues = {
	recordStatus?: string;
	recordTitle?: string;
	recordNotes?: string;
	expectedReturnAt?: Date;
	returnLocation?: string;
	rentingItems?: RentingItem[];
};
export type EditVerificationFormValues = {
	isRecordSerious?: boolean;
	verificationComments?: string;
};

// Custom data type
export type EditImageProofValues = {
	itemId: string;
	imageProof: Blob;
};
export type ItemAvailabilityRecordValues = Item & {
	earliestReturnBy?: Date;
};
export type ItemAvailabilityRecordInfoValues = {
	renterName?: string;
	expectedReturnAt?: string | Date;
	rentQuantity?: string | number;
};

// Table record info
export type UserInfoValues = {
	name?: string;
	email?: string;
	createdAt?: string | Date;
};
export type ItemInfoValues = {
	itemName?: string;
	itemDescription?: string;
	itemCategory?: string;
	itemQuantity?: string | number; // Total quantity
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
	createdBy?: string | Omit<User, 'createdBy'>;
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
	itemQuantity: string | number; // Total quantity
	itemStatus: string;
	createdAt: string | Date;
	createdBy: string | User;
	itemCategory?: string;
	itemDescription?: string;
	remainingQuantity?: string | number; // Derived quantity variable
};

export type ItemEditableFields = {
	itemName?: string;
	itemQuantity?: string | number;
	itemCategory?: string;
	itemDescription?: string;
	itemStatus?: string;
	createdAt?: string | Date;
	createdBy?: string | User;
	itemImages?: string[];
};

export type RentingItem = {
	item: string | Item;
	rentQuantity: string | number;
	proofOfReturn?: string | Blob;
};

export type RentalRecord = {
	recordId: string;
	renter: string | User;
	recordTitle: string;
	recordNotes?: string;
	recordStatus: string;
	rentingItems: RentingItem[];
	rentImages: string[];
	rentedAt: string | Date;
	expectedReturnAt: string | Date;
	returnedAt?: string | Date;
	returnImages?: string[];
	returnLocation?: string;
};

export type RentalRecordEditableFields = {
	recordTitle?: string;
	recordNotes?: string;
	rentingItems?: RentingItem[];
	recordStatus?: string;
	returnedAt?: string;
	returnImages?: string[];
	returnLocation?: string;
	expectedReturnAt?: string;
};

export type Verification = {
	verificationId: string;
	record: string | RentalRecord; // Rental record id
	createdAt: string | Date;
	updatedAt?: string | Date;
	verifiedBy?: string | User;
	isRecordSerious?: boolean;
	verificationComments?: string;
};

export type VerificationEditableFields = {
	updatedAt?: string | FieldValue;
	verifiedBy?: string | FieldValue;
	isRecordSerious?: boolean | FieldValue;
	verificationComments?: string | FieldValue;
};

export type FormValues =
	| AddUserFormValues
	| AddItemFormValues
	| UserInfoValues
	| ItemInfoValues
	| NewRentingItemFormValues
	| NewRentFormValues
	| ReturnFormValues
	| EditRentalRecordFormValues
	| EditVerificationFormValues;
export type FormKeys =
	| keyof AddUserFormValues
	| keyof AddItemFormValues
	| keyof UserInfoValues
	| keyof ItemInfoValues
	| keyof NewRentingItemFormValues
	| keyof NewRentFormValues
	| keyof ReturnFormValues
	| keyof EditRentalRecordFormValues;
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
// Item
export const mapItemStatus = (status: string) => {
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
		case 'rent_reverifying':
			return 'New';

		case 'active':
			return 'Active';

		case 'returning':
		case 'return_reverifying':
			return 'Returning';

		case 'completed':
			return 'Completed';

		case 'rent_rejected':
			return 'Rejected rent';

		case 'return_rejected':
			return 'Rejected return';

		case 'paid':
			return 'Paid';

		default:
			return status;
	}
};

export const mapRejectionType = (status: string) => {
	switch (status) {
		case 'rent_rejected':
			return 'Rent';

		case 'return_rejected':
			return 'Return';

		default:
			return status;
	}
};
export const mapPaymentAmount = (record: RentalRecord) => {
	if ((record.returnedAt as Date) < (record.expectedReturnAt as Date)) {
		return 5;
	}

	switch (record.recordStatus) {
		case 'rent_rejected':
			return 5;

		case 'return_rejected':
			return 20;

		default:
			return 20;
	}
};
