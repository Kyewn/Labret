'use client';

import {addDays, format} from 'date-fns';
import * as React from 'react';
import {DateRange} from 'react-day-picker';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/utils/utils';
import {CalendarDays} from 'lucide-react';

type Props = {
	onSelectRange: (dateRange: DateRange) => void;
};

export const DatePickerWithRange: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({
	onSelectRange,
	...htmlAttributes
}) => {
	const {className} = htmlAttributes;
	const [date, setDate] = React.useState<DateRange | undefined>(() => {
		const toDate = addDays(new Date(), 20);
		toDate.setHours(23, 59, 59, 999);

		return {
			from: new Date(),
			to: toDate
		};
	});

	const handleSelectRange = (dateRange: DateRange | undefined) => {
		const adjustedDateRange = {
			from: dateRange?.from,
			to:
				dateRange?.to &&
				new Date(
					dateRange.to.getFullYear(),
					dateRange.to.getMonth(),
					dateRange.to.getDate(),
					23,
					59,
					59,
					999
				)
		};

		setDate(adjustedDateRange);
		onSelectRange(adjustedDateRange);
	};

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarDays className='mr-2 h-4 w-4' />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleSelectRange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
