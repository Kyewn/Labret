/* eslint-disable @typescript-eslint/no-explicit-any */
import {TableData} from '@/components/ui/Table/TableGroup';
import {FormValueKeys, FormValues} from '@/utils/const';
import {Input, Text, Textarea, VStack} from '@chakra-ui/react';
import {UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'register'>> & {
	label: string;
	name: FormValueKeys;
	colKey?: string;
	value?: string;
	valueType?: string;
	isEditing?: boolean;
	useTextArea?: boolean;
	handleChange?: (newData: TableData) => void;
};

export const EditableField: React.FC<Props> = ({
	label,
	name,
	colKey,
	value,
	valueType,
	isEditing,
	useTextArea,
	handleChange,
	register
}) => {
	const registerProps = register?.(name);
	const onChange = registerProps?.onChange;

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
						{...(register && registerProps)}
						onChange={(e) => {
							onChange?.(e);
							colKey && handleChange?.({[colKey]: e.target.value});
						}}
					/>
				) : (
					<Input
						minWidth={'250px'}
						maxWidth={'400px'}
						type={valueType}
						{...(register && registerProps)}
					/>
				)
			) : (
				<Text>{value || '--'}</Text>
			)}
		</VStack>
	);
};
