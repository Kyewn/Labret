import {Datepicker} from 'flowbite-react';
import './DatePicker.css';

type Props = {
	date: Date;
	minDate?: Date;
	maxDate?: Date;
	onSelectedDateChanged: (date: Date) => void;
};

const theme = {
	popup: {
		footer: {
			button: {
				base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium',
				clear: 'clear-button text-white'
			}
		}
	},
	views: {
		days: {
			items: {
				item: {
					base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 date-item-base',
					selected: 'selected-date-bg text-white',
					disabled: 'text-gray-300'
				}
			}
		},
		months: {
			items: {
				item: {
					base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 date-item-base',
					selected: 'selected-date-bg text-white',
					disabled: 'text-gray-300'
				}
			}
		},
		years: {
			items: {
				item: {
					base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 date-item-base',
					selected: 'selected-date-bg text-white',
					disabled: 'text-gray-300'
				}
			}
		},
		decades: {
			items: {
				item: {
					base: 'block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 date-item-base',
					selected: 'selected-date-bg text-white',
					disabled: 'text-gray-300'
				}
			}
		}
	}
};

export const DatePicker: React.FC<Props> = ({date, minDate, maxDate, onSelectedDateChanged}) => {
	const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

	return (
		<Datepicker
			theme={theme}
			value={formattedDate}
			minDate={minDate}
			maxDate={maxDate}
			showTodayButton={false}
			onSelectedDateChanged={(date) => onSelectedDateChanged(date)}
		/>
	);
};
