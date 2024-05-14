/* eslint-disable @typescript-eslint/no-explicit-any */
import {TableData} from '@/components/ui/Table/TableGroup';
import {Input, Text, Textarea, VStack} from '@chakra-ui/react';
import {UseFormRegisterReturn, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<any>, 'register'>> &
	Partial<Pick<UseFormRegisterReturn<any>, 'onChange'>> & {
		label: string;
		name: string;
		colKey?: string;
		value?: string;
		valueType?: string;
		isEditing?: boolean;
		useTextArea?: boolean;
		handleChange?: (newData: TableData) => void;
	};

export const EditableField: React.FC<Props> = ({
	register,
	onChange,
	label,
	name,
	colKey,
	value,
	valueType,
	isEditing,
	useTextArea,
	handleChange
}) => {
	return (
		<VStack spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} size={'sm'}>
				{label}
			</Text>
			{isEditing ? (
				useTextArea || (value && value.length > 50) ? (
					<Textarea
						minWidth={'250px'}
						value={value || ''}
						resize={'both'}
						{...(register && register(name))}
					/>
				) : (
					<Input
						minWidth={'250px'}
						maxWidth={'400px'}
						type={valueType}
						{...(register && register(name))}
						onChange={(e) => {
							onChange?.(e);
							colKey && handleChange?.({[colKey]: e.target.value});
						}}
					/>
				)
			) : (
				<Text>{value || '--'}</Text>
			)}
		</VStack>
	);
};
