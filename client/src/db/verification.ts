import {db} from '@/db/firebase-init';
import {getRecord} from '@/db/record';
import {getUser} from '@/db/user';
import {Verification} from '@/utils/data';
import {addDoc, collection, deleteDoc, getDocs, updateDoc} from 'firebase/firestore';

export const verificationCollection = collection(db, 'verifications');

export const getAllVerifications = async () => {
	const querySnapshot = await getDocs(verificationCollection);

	const verifications = await Promise.all(
		querySnapshot.docs.map(async (doc) => {
			const verification = doc.data() as Verification;
			const record = await getRecord(verification.record as string);
			const {createdAt, updatedAt, verifiedBy} = verification;
			const parsedVerifiedBy = verifiedBy ? await getUser(verifiedBy as string) : undefined;

			return {
				...verification,
				verificationId: doc.id,
				record,
				createdAt: new Date(createdAt),
				...(updatedAt && {updatedAt: new Date(updatedAt)}),
				...(verifiedBy && {verifiedBy: parsedVerifiedBy})
			};
		})
	);

	return verifications as Verification[];
};

export const getVerification = async (verificationId: string) => {
	const queryResult = (await getDocs(verificationCollection)).docs.filter(
		(doc) => verificationId == doc.id
	)[0];
	const verification = queryResult.data() as Verification;
	const record = await getRecord(verification.record as string);
	const {createdAt, updatedAt, verifiedBy} = verification;
	const parsedVerifiedBy = verifiedBy ? await getUser(verifiedBy as string) : undefined;

	return {
		...verification,
		verificationId,
		record,
		createdAt: new Date(createdAt),
		...(updatedAt && {updatedAt: new Date(updatedAt)}),
		...(verifiedBy && {verifiedBy: parsedVerifiedBy})
	};
};

export const createVerification = async (recordId: string) => {
	const doc = await addDoc(verificationCollection, {
		record: recordId,
		createdAt: new Date().toISOString()
	} as Omit<Verification, 'verificationId'>);
	return doc;
};

export const editVerification = async (
	verificationId: string,
	updatedValues: VerificationEditableFields
) => {
	const queryResult = (await getDocs(verificationCollection)).docs.filter(
		(doc) => verificationId == doc.id
	)[0];
	const docRef = queryResult.ref;
	await updateDoc(docRef, updatedValues);
	return true;
};

export const deleteVerification = async (verificationId: string) => {
	const queryResult = (await getDocs(verificationCollection)).docs.filter(
		(doc) => verificationId == doc.id
	)[0];
	const docRef = queryResult.ref;
	await deleteDoc(docRef);
	return true;
};
