import {TableData} from '@/components/ui/Table/TableGroup';
import {DatePickerWithRange} from '@/components/ui/dateRangePicker';
import {FormKeys, FormValues} from '@/utils/data';
import {formatDate} from '@/utils/utils';
import {Text, VStack} from '@chakra-ui/react';
import {DateRange} from 'react-day-picker';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'setValue'>> & {
	label: string;
	name: FormKeys;
	value?: DateRange;
	isEditing?: boolean;
	rules?: RegisterOptions<FormValues, FormKeys>;
	handleChange?: (newData: TableData) => void;
};

export const EditableDate: React.FC<Props> = ({
	label,
	name,
	value,
	isEditing,
	handleChange,
	rules,
	setValue
}) => {
	return (
		<VStack width={'100%'} spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required ? label + ' *' : label}
			</Text>
			{
				// Editing
				isEditing ? (
					<DatePickerWithRange
						drValue={value as DateRange}
						onSelectRange={(dateRange: DateRange) => {
							setValue && setValue(name, dateRange);
							handleChange && handleChange({[name]: dateRange});
						}}
					/>
				) : (
					// Not editing
					<Text>
						{formatDate((value as DateRange)?.from as Date) || '--'} -{' '}
						{formatDate((value as DateRange)?.to as Date) || '--'}
					</Text>
				)
			}
		</VStack>
	);
};
