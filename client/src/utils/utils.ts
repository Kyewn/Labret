import {clsx, type ClassValue} from 'clsx';
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
