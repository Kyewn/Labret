import {DatePicker} from '@/components/DatePicker/DatePicker';
import {TableData} from '@/components/ui/Table/TableGroup';
import {formatDate} from '@/utils/dataType';
import {Heading, Text, VStack} from '@chakra-ui/react';
import {useState} from 'react';

type Props = {
	label: string;
	colKey: string;
	value: Date;
	maxDate?: Date;
	minDate?: Date;
	isEditing?: boolean;
	onChange?: (newData: TableData) => void;
};

export const EditableDate: React.FC<Props> = ({
	label,
	colKey,
	value,
	maxDate,
	minDate,
	isEditing,
	onChange
}) => {
	const [date, setDate] = useState(value);

	return (
		<VStack width={'100%'} spacing={1} alignItems={'flex-start'}>
			<Heading as={'h2'} size={'sm'}>
				{label}
			</Heading>
			{isEditing ? (
				<DatePicker
					date={date}
					maxDate={maxDate}
					minDate={minDate}
					onSelectedDateChanged={(date) => {
						setDate(date);
						onChange?.({[colKey]: date});
					}}
				/>
			) : (
				<Text>{formatDate(value) || '--'}</Text>
			)}
		</VStack>
	);
};
