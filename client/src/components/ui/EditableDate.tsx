import {DatePicker} from '@/components/ui/DatePicker/DatePicker';
import {TableData} from '@/components/ui/Table/TableGroup';
import {FormKeys, FormValues} from '@/utils/data';
import {formatDate} from '@/utils/utils';
import {Text, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'setValue'>> & {
	label: string;
	name: FormKeys;
	value: Date;
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
					<DatePicker
						date={value}
						maxDate={maxDate}
						minDate={minDate}
						onSelectedDateChanged={(date) => {
							setValue && setValue(name, date);
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
