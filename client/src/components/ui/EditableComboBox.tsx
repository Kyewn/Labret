import {ComboBox, ComboBoxItemType} from '@/components/ui/ComboBox';
import {FormKeys, FormValues} from '@/utils/data';
import {Text, VStack} from '@chakra-ui/react';
import {RegisterOptions, UseFormReturn} from 'react-hook-form';

type Props = Partial<Pick<UseFormReturn<FormValues>, 'setValue'>> & {
	name: FormKeys;
	label: string;
	items?: ComboBoxItemType[];
	initValue?: ComboBoxItemType;
	value?: ComboBoxItemType;
	placeholder?: string;
	searchKey?: string;
	itemIdKey?: string;
	isClearEnabled?: boolean;
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
	searchKey,
	itemIdKey,
	isEditing,
	isCreateNewOnNoneEnabled,
	isClearEnabled,
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
					items={items}
					value={value}
					initValue={initValue}
					searchKey={searchKey}
					itemIdKey={itemIdKey}
					placeholder={placeholder || 'Search or add new...'}
					isCreateNewOnNoneEnabled={isCreateNewOnNoneEnabled}
					isClearEnabled={isClearEnabled}
					handleChange={handleChange}
					setValue={setValue}
				/>
			) : (
				<Text>
					{((value?.substring
						? value // String type value
						: (value as Record<string, unknown>)?.[searchKey as string]) as string) || // Object type value
						'--'}
				</Text>
			)}
			{errorMessage && (
				<Text fontSize={'xs'} mt={1} color={'lrRed.300'}>
					{errorMessage}
				</Text>
			)}
		</VStack>
	);
};
