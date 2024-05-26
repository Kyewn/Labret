/* eslint-disable @typescript-eslint/no-explicit-any */
import {TableData} from '@/components/ui/Table/TableGroup';
import {FormKeys, FormValues} from '@/utils/data';
import {Input, Text, Textarea, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'register'>> & {
	label: string;
	name: FormKeys;
	colKey?: string;
	value?: string;
	valueType?: string;
	isEditing?: boolean;
	useTextArea?: boolean;
	rules?: RegisterOptions<FormValues, FormKeys>;
	errorMessage?: string;
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
	errorMessage,
	rules,
	handleChange,
	register
}) => {
	const registerProps = rules ? register?.(name, rules) : register?.(name);
	const onChange = registerProps?.onChange;

	return (
		<VStack spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required ? label + ' *' : label}
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
						onChange={(e) => {
							onChange?.(e);
							colKey && handleChange?.({[colKey]: e.target.value});
						}}
					/>
				)
			) : (
				<Text>{value || '--'}</Text>
			)}
			{errorMessage && (
				<Text fontSize={'xs'} mt={1} color={'lrRed.300'}>
					{errorMessage}
				</Text>
			)}
		</VStack>
	);
};
