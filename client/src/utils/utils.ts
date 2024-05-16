import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

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
