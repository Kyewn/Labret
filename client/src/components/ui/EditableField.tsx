/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormKeys, FormValues, InputData} from '@/utils/data';
import {Input, Text, Textarea, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'register'>> & {
	label: string;
	name: FormKeys | string;
	value?: string;
	valueType?: string;
	isEditing?: boolean;
	useTextArea?: boolean;
	rules?: RegisterOptions<FormValues, FormKeys>;
	errorMessage?: string;
	handleChange?: (newData: InputData) => void;
};

export const EditableField: React.FC<Props> = ({
	label,
	name,
	value,
	valueType,
	isEditing,
	useTextArea,
	errorMessage,
	rules,
	handleChange,
	register
}) => {
	const registerProps = rules ? register?.(name as FormKeys, rules) : register?.(name as FormKeys);
	const onChange = registerProps?.onChange;

	return (
		<VStack w={'100%'} spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required && isEditing ? label + ' *' : label}
			</Text>
			{isEditing ? (
				useTextArea || (value && value.length > 50) ? (
					<Textarea
						minWidth={'250px'}
						maxW={'100%'}
						value={value || ''}
						resize={'both'}
						{...(register && registerProps)}
						onChange={(e) => {
							onChange?.(e);
							handleChange && handleChange?.({[name]: e.target.value});
						}}
					/>
				) : (
					<Input
						minWidth={'250px'}
						maxWidth={'400px'}
						type={valueType}
						value={value || ''}
						{...(register && registerProps)}
						onChange={(e) => {
							onChange?.(e);
							handleChange && handleChange?.({[name]: e.target.value});
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
