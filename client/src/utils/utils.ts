import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'node_modules/tailwind-merge/src/lib/tw-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
