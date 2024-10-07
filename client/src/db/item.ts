import {db} from '@/db/firebase-init';
import {getAllRecords} from '@/db/record';
import {getAllAdmins} from '@/db/user';
import {
	AddItemFormValues,
	Item,
	ItemEditableFields,
	RentalRecord,
	RentingItem,
	User
} from '@/utils/data';
import {addDoc, collection, deleteDoc, getDocs, updateDoc} from 'firebase/firestore';

export const itemCollection = collection(db, 'items');

export const getAllBaseItems = async () => {
	const querySnapshot = await getDocs(itemCollection);
	const admins = await getAllAdmins();
	const items = querySnapshot.docs.map((doc) => {
		const item = doc.data() as Item;
		const createdBy = (admins.find((admin) => admin.id === item.createdBy) as User) || {
			id: 'Unknown',
			name: 'Unknown',
			email: '',
			status: '',
			type: '',
			createdAt: new Date(),
			imageUrls: []
		};
		return {
			...item,
			itemId: doc.id,
			createdAt: new Date(doc.data().createdAt) as Date,
			createdBy
		};
	});
	return items as Item[];
};

export const getAllItems = async () => {
	const querySnapshot = await getDocs(itemCollection);
	const admins = await getAllAdmins();
	const records = await getAllRecords();
	const items = querySnapshot.docs.map((doc) => {
		const item = doc.data() as Item;
		const itemId = doc.id as string;
		const {createdAt, itemQuantity} = item;

		// Get createdBy user
		const createdBy = (admins.find((admin) => admin.id === item.createdBy) as User) || {
			id: 'Unknown',
			name: 'Unknown',
			email: '',
			status: '',
			type: '',
			createdAt: new Date(),
			imageUrls: []
		};
		// Calculate remaining quantity
		const targetItemInRelatedRecords = records
			.filter((record) => {
				return (
					record.recordStatus !== 'completed' &&
					record.recordStatus != 'paid' &&
					record.rentingItems.some((rentingItem) => (rentingItem.item as Item).itemId === itemId)
				);
			}) // relatedRecords
			.map(
				(record) =>
					record.rentingItems.find(
						(rentingItem) => (rentingItem.item as Item).itemId === itemId
					) as RentingItem
			); // getting target item from record
		const remainingQuantity = records.length
			? (itemQuantity as number) -
			  targetItemInRelatedRecords.reduce((acc, record) => acc + (record.rentQuantity as number), 0)
			: (itemQuantity as number);
		return {
			...item,
			itemId,
			remainingQuantity,
			createdBy,
			createdAt: new Date(createdAt)
		};
	});
	return items as Item[];
};

export const getItem = async (itemId: string) => {
	const admins = await getAllAdmins();
	const records = (await getAllRecords()) as RentalRecord[];

	const queryResult = (await getDocs(itemCollection)).docs.filter((doc) => itemId == doc.id)[0];
	const item = queryResult.data() as Item;
	const {createdAt, itemQuantity} = item;

	// Get createdBy user
	const createdBy = (admins.find((admin) => admin.id === item.createdBy) as User) || {
		id: 'Unknown',
		name: 'Unknown',
		email: '',
		status: '',
		type: '',
		createdAt: new Date(),
		imageUrls: []
	};
	// Calculate remaining quantity
	const targetItemInRelatedRecords = records
		.filter((record) => {
			return (
				record.recordStatus !== 'completed' &&
				record.recordStatus != 'paid' &&
				record.rentingItems.some((rentingItem) => (rentingItem.item as Item).itemId === itemId)
			);
		}) // relatedRecords
		.map(
			(record) =>
				record.rentingItems.find(
					(rentingItem) => (rentingItem.item as Item).itemId === itemId
				) as RentingItem
		); // getting target item from record
	const remainingQuantity = records.length
		? (itemQuantity as number) -
		  targetItemInRelatedRecords.reduce((acc, record) => acc + (record.rentQuantity as number), 0)
		: (itemQuantity as number);
	return {
		...item,
		itemId,
		remainingQuantity,
		createdBy,
		createdAt: new Date(createdAt)
	} as Item;
};

export const createItem = async (data: AddItemFormValues, adminId: string) => {
	const doc = await addDoc(itemCollection, {
		...data,
		itemQuantity: Number.parseInt(data.itemQuantity as string),
		itemStatus: 'pending',
		createdAt: new Date().toISOString(),
		createdBy: adminId
	});
	return doc;
};

export const editItem = async (itemId: string, updatedValues: ItemEditableFields) => {
	const queryResult = (await getDocs(itemCollection)).docs.filter((doc) => itemId == doc.id)[0];
	const docRef = queryResult.ref;
	await updateDoc(docRef, updatedValues);
	return true;
};

export const deleteItem = async (itemId: string) => {
	const queryResult = (await getDocs(itemCollection)).docs.filter((doc) => itemId == doc.id)[0];
	const docRef = queryResult.ref;
	await deleteDoc(docRef);
	return true;
};
