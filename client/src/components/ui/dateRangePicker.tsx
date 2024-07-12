'use client';

import {format} from 'date-fns';
import * as React from 'react';
import {DateRange} from 'react-day-picker';

import {Button} from '@/components/ui/button';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/utils/utils';
import {CalendarDays} from 'lucide-react';

type Props = {
	placeholder?: string;
	drValue?: DateRange;
	onSelectRange: (dateRange: DateRange) => void;
};

export const DatePickerWithRange: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({
	placeholder,
	drValue,
	onSelectRange,
	...htmlAttributes
}) => {
	const {className} = htmlAttributes;

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

		onSelectRange(adjustedDateRange);
	};

	return (
		<div className={cn('grid gap-2', className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id='drValue'
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!drValue && 'text-muted-foreground'
						)}
					>
						<CalendarDays className='mr-2 h-4 w-4' />
						{drValue?.from ? (
							drValue?.to ? (
								<>
									{format(drValue.from, 'LLL dd, y')} - {format(drValue.to, 'LLL dd, y')}
								</>
							) : (
								<>{format(drValue.from, 'LLL dd, y')} - ??</>
							)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={drValue?.from}
						selected={drValue}
						onSelect={handleSelectRange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};
