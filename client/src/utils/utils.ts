import {FaceResult} from '@/utils/data';
import {clsx, type ClassValue} from 'clsx';
import {addDays} from 'date-fns';
import {twMerge} from 'tailwind-merge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const swrFetcher = async (url: string): Promise<any> => fetch(url).then((res) => res.json());

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise<string>((resolve) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(blob);
		fileReader.onload = () => {
			const result = fileReader.result as string;
			const base64String = result.split(',')[1];
			resolve(base64String);
		};
	});
};

export const formatDate = (date: Date) =>
	`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const formatDateAndTime = (date: Date) =>
	date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

export const createNewDate = (isDateRange: boolean = false) => {
	const date = new Date();
	date.setHours(0, 0, 0, 0);
	const toDate = addDays(new Date(), 20);
	toDate.setHours(23, 59, 59, 999);

	return isDateRange
		? {
				from: date,
				to: toDate
		  }
		: date;
};

export const predictFaces = async (faceBlob: Blob[]) => {
	const faceBase64s = await Promise.all(
		faceBlob.map(async (blob) => await convertBlobToBase64(blob))
	);
	const predictFaceApiUrl = 'http://localhost:8000/predict-face';

	const res = await fetch(predictFaceApiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			images: faceBase64s
		})
	});
	const resJson = await res.json();
	const parsedJson = JSON.parse(
		JSON.stringify(resJson).replace(/nan/gi, 'null').replace(/None/g, 'null')
	);
	const parsedData = parsedJson.data as FaceResult;

	return parsedData;
};
