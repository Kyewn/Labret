import {
	Button,
	Flex,
	HStack,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	VStack
} from '@chakra-ui/react';
import {ChevronDown} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';

export type ComboBoxItemType = Record<string, unknown> | (string | undefined);

type Props = Partial<Pick<UseFormReturn, 'setValue'>> & {
	name: string;
	value: ComboBoxItemType;
	initValue?: ComboBoxItemType;
	placeholder?: string;
	items?: ComboBoxItemType[];
	itemIdKey?: string;
	searchKey?: string;
	handleChange?: (item: ComboBoxItemType) => void;
	isClearEnabled?: boolean;
	isCreateNewOnNoneEnabled?: boolean;
};

export const ComboBox: React.FC<Props> = ({
	items,
	name,
	initValue,
	value,
	placeholder,
	searchKey,
	itemIdKey,
	isCreateNewOnNoneEnabled,
	isClearEnabled,
	handleChange,
	setValue
}) => {
	const [searchText, setSearchText] = useState('');
	const [visibleItems, setVisibleItems] = useState(items);

	const handleReset = () => {
		if (initValue?.substring) {
			// String type items
			setSearchText('');
			setValue?.(name, initValue as string);
			handleChange?.(initValue as string);
		} else {
			// Record<string, unknown> type items
			setSearchText('');
			setValue?.(name, initValue);
			handleChange?.(initValue);
		}
	};
	const handleClear = () => {
		if (value?.substring) {
			// String type items
			setSearchText('');
			setValue?.(name, undefined);
			handleChange?.(undefined);
		}
	};

	// Handle search bar
	useEffect(() => {
		if (searchText) {
			if (items?.[0]?.substring) {
				// string type items
				setVisibleItems(
					items?.filter((item) =>
						(item as string).trim().toLowerCase().includes(searchText.trim().toLowerCase())
					)
				);
				return;
			}

			// Record<string, unknown> type items
			searchKey &&
				setVisibleItems(
					items?.filter((item) =>
						((item as Record<string, unknown>)?.[searchKey] as string)
							.trim()
							.toLowerCase()
							.includes(searchText.trim().toLowerCase())
					)
				);
		} else {
			setVisibleItems(items);
		}
	}, [searchText]);

	const renderItems = () => {
		if (!visibleItems?.length) {
			return <Flex paddingY={5}>No items found</Flex>;
		}

		return visibleItems?.map((item, i) => {
			return (
				<MenuItem
					// key={i}
					key={(itemIdKey && ((item as Record<string, unknown>)?.[itemIdKey] as string)) || i}
					onClick={() => {
						setValue?.(name, visibleItems[i]);
						handleChange?.(visibleItems[i]);
					}}
				>
					{(searchKey && ((item as Record<string, unknown>)?.[searchKey] as string)) ||
						(item as string)}
				</MenuItem>
			);
		});
	};

	return (
		<Menu>
			{({isOpen}) => {
				if (!isOpen && searchText) {
					// Handle selection on popper close
					const existingItemLabel = items?.find((item) => {
						if (item?.substring) {
							// string type items
							return (item as string).trim().toLowerCase() === searchText.trim().toLowerCase();
						} else {
							// Record<string, unknown> type
							return (
								searchKey &&
								((item as Record<string, unknown>)?.[searchKey] as string).trim().toLowerCase() ===
									searchText.trim().toLowerCase()
							);
						}
					});
					if (existingItemLabel) {
						setValue?.(name, existingItemLabel);
						handleChange?.(existingItemLabel);
					}

					setSearchText('');
				}

				const parsedValue = value?.substring
					? (value as string | undefined)
					: ((value as Record<string, unknown>)?.[searchKey as string] as string);

				return (
					<>
						<MenuButton as={Button} rightIcon={<ChevronDown />}>
							{parsedValue?.length ? parsedValue : placeholder}
						</MenuButton>
						<MenuList p={2}>
							<HStack mb={2}>
								<Input
									key={'combo-box-input'}
									value={searchText}
									onChange={(e) => {
										const newValue = e.target.value;
										if (isCreateNewOnNoneEnabled && !!newValue.length) {
											setValue?.(name, newValue);
											setSearchText(newValue);
											handleChange?.(newValue);
										}
									}}
									placeholder={placeholder || 'Search...'}
								/>
								{isClearEnabled && (
									<Button variant={'outline'} onClick={handleClear}>
										Clear
									</Button>
								)}
								{initValue && (
									<Button variant={'outline'} onClick={handleReset}>
										Reset
									</Button>
								)}
							</HStack>
							<VStack>{renderItems()}</VStack>
						</MenuList>
					</>
				);
			}}
		</Menu>
	);
};
