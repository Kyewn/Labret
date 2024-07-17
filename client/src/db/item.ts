import {db} from '@/db/firebase-init';
import {getAllUsers} from '@/db/user';
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

export const getAllItems = async () => {
	const querySnapshot = await getDocs(itemCollection);
	const users = await getAllUsers();
	const records = (await getAllRecords()) as RentalRecord[];
	const items = querySnapshot.docs.map((doc) => {
		const item = doc.data() as Item;
		// Get createdBy user
		const createdBy = users.find((user) => user.id === item.createdBy) as User;
		// Calculate remaining quantity
		const targetItemInRelatedRecords = records
			.filter((record) =>
				record.rentingItems.some((rentingItem) => (rentingItem.item as Item).itemId === item.itemId)
			) // relatedRecords
			.map(
				(record) =>
					record.rentingItems.find(
						(rentingItem) => (rentingItem.item as Item).itemId === item.itemId
					) as RentingItem
			); // getting target item from record
		const remainingQuantity = targetItemInRelatedRecords.reduce(
			(acc, record) => acc + (record.rentQuantity as number),
			0
		);

		return {
			...(doc.data() as Omit<Item, 'id' | 'createdAt'>),
			id: doc.id,
			createdAt: new Date(item.createdAt) as Date,
			createdBy,
			remainingQuantity
		};
	});
	return items as Item[];
};

export const getItem = async (itemId: string) => {
	const users = await getAllUsers();
	const records = (await getAllRecords()) as RentalRecord[];

	const queryResult = (await getDocs(itemCollection)).docs.filter((doc) => itemId == doc.id)[0];
	const item = queryResult.data() as Item;

	// Get createdBy user
	const createdBy = users.find((user) => user.id === item.createdBy) as User;
	// Calculate remaining quantity
	const targetItemInRelatedRecords = records
		.filter((record) =>
			record.rentingItems.some((rentingItem) => (rentingItem.item as Item).itemId === item.itemId)
		) // relatedRecords
		.map(
			(record) =>
				record.rentingItems.find(
					(rentingItem) => (rentingItem.item as Item).itemId === item.itemId
				) as RentingItem
		); // getting target item from record
	const remainingQuantity = targetItemInRelatedRecords.reduce(
		(acc, record) => acc + (record.rentQuantity as number),
		0
	);
	return {
		...item,
		itemId,
		createdAt: new Date(item.createdAt) as Date,
		createdBy,
		remainingQuantity
	} as Item;
};

export const createItem = async (data: AddItemFormValues, adminId: string) => {
	const doc = await addDoc(itemCollection, {
		...data,
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
