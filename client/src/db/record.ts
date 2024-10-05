import {db} from '@/db/firebase-init';
import {getAllBaseItems} from '@/db/item';
import {getAllUsers} from '@/db/user';
import {AddRecordFormValues, Item, RentalRecord, User} from '@/utils/data';
import {addDoc, collection, deleteDoc, getDocs, updateDoc} from 'firebase/firestore';

export const recordCollection = collection(db, 'records');

export const getAllRecords = async () => {
	const querySnapshot = await getDocs(recordCollection);
	const users = await getAllUsers();
	const items = await getAllBaseItems();

	const records = querySnapshot.docs.map((doc) => {
		const record = doc.data() as RentalRecord;
		const {rentedAt, expectedReturnAt, returnedAt} = record;

		const parsedRenter = users.find((user) => user.id === (record.renter as string)) as User;
		const parsedRentingItems = record.rentingItems.map((rentingItem) => {
			return {
				...rentingItem,
				item: items.find((item) => item.itemId == (rentingItem.item as string)) as Item
			};
		});

		return {
			...record,
			renter: parsedRenter,
			rentingItems: parsedRentingItems,
			rentedAt: new Date(rentedAt),
			expectedReturnAt: new Date(expectedReturnAt),
			...(returnedAt && {returnedAt: new Date(returnedAt)})
		};
	});

	return records as RentalRecord[];
};

export const getRecord = async (recordId: string) => {
	const users = await getAllUsers();
	const items = await getAllBaseItems();

	const queryResult = (await getDocs(recordCollection)).docs.filter((doc) => recordId == doc.id)[0];
	const record = queryResult.data() as RentalRecord;
	const {rentedAt, expectedReturnAt, returnedAt} = record;

	// Get createdBy user
	const parsedRenter = users.find((user) => user.id === (record.renter as string)) as User;
	const parsedRentingItems = record.rentingItems.map((rentingItem) => {
		return {
			...rentingItem,
			item: items.find((item) => item.itemId == (rentingItem.item as string)) as Item
		};
	});
	return {
		...record,
		recordId,
		renter: parsedRenter,
		rentingItems: parsedRentingItems,
		rentedAt: new Date(rentedAt),
		expectedReturnAt: new Date(expectedReturnAt),
		...(returnedAt && {returnedAt: new Date(returnedAt)})
	} as RentalRecord;
};

export const createRecord = async (data: AddRecordFormValues, renterId: string) => {
	const doc = await addDoc(recordCollection, {
		...data,
		renter: renterId,
		rentedAt: new Date().toISOString(),
		recordStatus: 'pending'
	});
	return doc;
};

export const editRecord = async (recordId: string, updatedValues: RentalRecordEditableFields) => {
	const queryResult = (await getDocs(recordCollection)).docs.filter((doc) => recordId == doc.id)[0];
	const docRef = queryResult.ref;
	await updateDoc(docRef, updatedValues);
	return true;
};

export const deleteRecord = async (recordId: string) => {
	const queryResult = (await getDocs(recordCollection)).docs.filter((doc) => recordId == doc.id)[0];
	const docRef = queryResult.ref;
	await deleteDoc(docRef);
	return true;
};
