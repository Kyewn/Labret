import {Button, Input, Menu, MenuButton, MenuItem, MenuList, VStack} from '@chakra-ui/react';
import {ChevronDown} from 'lucide-react';
import {useEffect, useState} from 'react';
import {UseFormReturn} from 'react-hook-form';

type Props<T> = Partial<Pick<UseFormReturn, 'setValue'>> & {
	items?: T[];
	itemIdKey: string;
	searchKey: string;
	name: string;
	value: string;
	placeholder?: string;
	handleChange?: (item: T) => void;
};

export const ComboBox: <T extends Record<string, unknown>>(props: Props<T>) => JSX.Element = <
	T extends Record<string, unknown>
>({
	items,
	name,
	value,
	placeholder,
	searchKey,
	itemIdKey,
	handleChange,
	setValue
}: Props<T>) => {
	const [searchText, setSearchText] = useState('');
	const [visibleItems, setVisibleItems] = useState(items);

	useEffect(() => {
		setVisibleItems(
			items?.filter((item) =>
				(item?.[searchKey] as string).trim().toLowerCase().includes(searchText.trim().toLowerCase())
			)
		);
	}, [searchText]);

	const renderItems = () =>
		visibleItems?.map((item, i) => {
			return (
				<MenuItem
					key={item?.[itemIdKey] as string}
					onClick={() => {
						setValue?.(name, visibleItems[i]);
						handleChange?.(visibleItems[i]);
					}}
				>
					{item?.[searchKey] as string}
				</MenuItem>
			);
		});

	return (
		<Menu>
			{({isOpen}) => {
				if (!isOpen) {
					// Handle selection on popper close
					const existingItemLabel = items?.find(
						(item) =>
							(item?.[searchKey] as string).trim().toLowerCase() === searchText.trim().toLowerCase()
					);
					if (existingItemLabel) {
						setValue?.(name, existingItemLabel);
						handleChange?.(existingItemLabel);
						setSearchText('');
					}
				}

				return (
					<>
						<MenuButton as={Button} rightIcon={<ChevronDown />}>
							{value}
						</MenuButton>
						<MenuList p={2}>
							<Input
								key={'combo-box-input'}
								value={searchText}
								onChange={(e) => {
									setSearchText(e.target.value);
								}}
								placeholder={placeholder || 'Create or search...'}
								mb={2}
							/>
							<VStack>{renderItems()}</VStack>
						</MenuList>
					</>
				);
			}}
		</Menu>
	);
};
