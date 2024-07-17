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
	initValue?: string;
	value: string;
	placeholder?: string;
	items?: ComboBoxItemType[];
	itemIdKey?: string;
	searchKey?: string;
	handleChange?: (item: ComboBoxItemType) => void;
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
	handleChange,
	setValue
}) => {
	const [searchText, setSearchText] = useState('');
	const [visibleItems, setVisibleItems] = useState(items);

	const handleReset = () => {
		setSearchText('');
		setValue?.(name, initValue as string);
		handleChange?.(initValue as string);
	};
	const handleClear = () => {
		setSearchText('');
		setValue?.(name, undefined);
		handleChange?.(undefined);
	};

	useEffect(() => {
		if (searchText) {
			if (items as string[]) {
				setVisibleItems(
					items?.filter((item) =>
						(item as string).trim().toLowerCase().includes(searchText.trim().toLowerCase())
					)
				);
				return;
			}

			// Record<string, unknown>[]
			searchKey &&
				setVisibleItems(
					items?.filter((item) =>
						((item as Record<string, unknown>)?.[searchKey] as string)
							.trim()
							.toLowerCase()
							.includes(searchText.trim().toLowerCase())
					)
				);
		}
	}, [searchText]);

	const renderItems = () => {
		if (!visibleItems?.length) {
			return <Flex paddingY={5}>No items found</Flex>;
		}

		return visibleItems?.map((item, i) => {
			return (
				<MenuItem
					// key={(itemIdKey && ((item as Record<string, unknown>)?.[itemIdKey] as string)) || i}
					key={i}
					onClick={() => {
						setValue?.(name, visibleItems[i]);
						handleChange?.(visibleItems[i]);
					}}
				>
					{(itemIdKey && ((item as Record<string, unknown>)?.[itemIdKey] as string)) ||
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
					const existingItemLabel = items?.find(
						(item) =>
							(searchKey &&
								((item as Record<string, unknown>)?.[searchKey] as string).trim().toLowerCase() ===
									searchText.trim().toLowerCase()) ||
							(item as string).trim().toLowerCase() === searchText.trim().toLowerCase()
					);
					if (existingItemLabel) {
						setValue?.(name, existingItemLabel);
						// handleChange?.(existingItemLabel);
					}
					setSearchText('');
				}

				return (
					<>
						<MenuButton as={Button} rightIcon={<ChevronDown />}>
							{value}
						</MenuButton>
						<MenuList p={2}>
							<HStack mb={2}>
								<Input
									key={'combo-box-input'}
									value={searchText}
									onChange={(e) => {
										isCreateNewOnNoneEnabled &&
											!!e.target.value.length &&
											setValue?.(name, e.target.value);
										setSearchText(e.target.value);
									}}
									placeholder={placeholder || 'Search...'}
								/>
								<Button variant={'outline'} onClick={handleClear}>
									Clear
								</Button>
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
