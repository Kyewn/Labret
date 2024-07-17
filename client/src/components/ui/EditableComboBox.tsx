import {ComboBox, ComboBoxItemType} from '@/components/ui/ComboBox';
import {FormKeys, FormValues} from '@/utils/data';
import {Text, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'setValue'>> & {
	name: FormKeys;
	label: string;
	initValue?: string;
	value?: string;
	placeholder: string;
	items?: ComboBoxItemType[];
	objItems?: Record<string, unknown>[];
	isCreateNewOnNoneEnabled?: boolean;
	isEditing?: boolean;
	errorMessage?: string;
	rules?: RegisterOptions<FormValues, FormKeys>;
	handleChange?: (item: ComboBoxItemType) => void;
};

export const EditableComboBox: React.FC<Props> = ({
	name,
	label,
	initValue,
	value,
	placeholder,
	items,
	isEditing,
	isCreateNewOnNoneEnabled,
	rules,
	errorMessage,
	handleChange,
	setValue
}) => {
	return (
		<VStack spacing={1} alignItems={'flex-start'}>
			<Text fontWeight={700} fontSize={'sm'}>
				{rules?.required ? label + ' *' : label}
			</Text>
			{isEditing ? (
				<ComboBox
					name={name}
					isCreateNewOnNoneEnabled={isCreateNewOnNoneEnabled}
					items={items}
					initValue={initValue}
					value={value || placeholder}
					placeholder='Search or add new...'
					handleChange={handleChange}
					setValue={setValue}
				/>
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
