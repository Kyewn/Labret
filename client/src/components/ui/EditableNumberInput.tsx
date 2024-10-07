import {FormKeys, FormValues, InputData} from '@/utils/data';
import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
	VStack
} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'register'>> & {
	name: string;
	label: string;
	value: number;
	min?: number;
	max?: number;
	isEditing?: boolean;
	errorMessage?: string;
	rules?: RegisterOptions<FormValues, FormKeys>;
	handleChange?: (strData: string, numData: number) => void;
	handleMEContextChange?: (newData: InputData) => void;
};

export const EditableNumberInput: React.FC<Props> = ({
	name,
	label,
	value,
	min,
	max,
	isEditing,
	rules,
	errorMessage,
	handleChange,
	handleMEContextChange,
	register
}) => {
	const registerProps = rules ? register?.(name as FormKeys, rules) : register?.(name as FormKeys);
	const onChange = registerProps?.onChange;

	return (
		<VStack spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required ? label + ' *' : label}
			</Text>
			{isEditing ? (
				<NumberInput
					allowMouseWheel
					min={min}
					max={max}
					defaultValue={value}
					onChange={(valueStr, value) => {
						handleChange?.(valueStr, value);
						handleMEContextChange?.({[name]: value});
					}}
				>
					<NumberInputField
						{...(register && registerProps)}
						onChange={(e) => {
							onChange?.(e);
						}}
					/>
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
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
