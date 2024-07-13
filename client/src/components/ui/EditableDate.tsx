import {DatePicker} from '@/components/ui/DatePicker/DatePicker';
import {TableData} from '@/components/ui/Table/TableGroup';
import {FormKeys, FormValues} from '@/utils/data';
import {createNewDate, formatDate} from '@/utils/utils';
import {Text, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'setValue'>> & {
	label: string;
	name: FormKeys | string;
	value?: Date;
	maxDate?: Date; // For single
	minDate?: Date; // For single
	isEditing?: boolean;
	rules?: RegisterOptions<FormValues, FormKeys>;
	handleChange?: (newData: TableData) => void;
};

export const EditableDate: React.FC<Props> = ({
	label,
	name,
	value,
	maxDate,
	minDate,
	isEditing,
	rules,
	setValue,
	handleChange
}) => {
	return (
		<VStack width={'100%'} spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required ? label + ' *' : label}
			</Text>
			{
				// Editing
				isEditing ? (
					<DatePicker
						date={value || (createNewDate() as Date)}
						maxDate={maxDate}
						minDate={minDate}
						onSelectedDateChanged={(date) => {
							setValue && setValue(name as FormKeys, date);
							handleChange && handleChange({[name]: date});
						}}
					/>
				) : (
					// Not editing
					<Text>{value ? formatDate(value as Date) : '--'}</Text>
				)
			}
		</VStack>
	);
};
