import {db} from '@/db/firebase-init';
import {AddUserFormValues, User, UserEditableFields} from '@/utils/data';
import {addDoc, collection, deleteDoc, getDocs, updateDoc} from 'firebase/firestore';

export const userCollection = collection(db, 'users');

export const getAllUsers = async () => {
	const querySnapshot = await getDocs(userCollection);
	const users = querySnapshot.docs.map((doc) => {
		const user = doc.data() as User;
		return {
			...(doc.data() as Omit<User, 'id' | 'createdAt'>),
			id: doc.id,
			createdAt: new Date(user.createdAt) as Date
		};
	});
	return users as User[];
};

export const getUser = async (userId: string) => {
	const queryResult = (await getDocs(userCollection)).docs.filter((doc) => userId == doc.id)[0];
	return queryResult.data() as User;
};

export const createUser = async (data: AddUserFormValues) => {
	const doc = await addDoc(userCollection, {
		...data,
		status: 'pending',
		type: 'user',
		createdAt: new Date().toISOString(),
		lastRentalAt: null
	});
	return doc;
};

export const editUser = async (userId: string, updatedValues: UserEditableFields) => {
	const queryResult = (await getDocs(userCollection)).docs.filter((doc) => userId == doc.id)[0];
	const docRef = queryResult.ref;
	await updateDoc(docRef, updatedValues);
	return true;
};

export const deleteUser = async (userId: string) => {
	const queryResult = (await getDocs(userCollection)).docs.filter((doc) => userId == doc.id)[0];
	const docRef = queryResult.ref;
	await deleteDoc(docRef);
	return true;
};
