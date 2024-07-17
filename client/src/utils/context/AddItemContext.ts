import {AddItemFormValues, Item} from '@/utils/data';
import {useSteps} from '@chakra-ui/react';
import {createContext, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

const steps = [
	{
		title: 'Acquire Image'
	},
	{
		title: 'Add Item Form'
	}
];

export const useInitialAddItemContext = () => {
	const imagesState = useState<Blob[]>([]);
	const {watch, register, trigger, setValue, formState, handleSubmit} =
		useForm<AddItemFormValues>();
	const {activeStep, goToNext, goToPrevious} = useSteps({count: steps.length});
	const [images, setImages] = imagesState;
	const itemsState = useState<Item[]>([]);
	const itemCategoriesState = useState<string[]>([]);
	const [, setItemCategories] = itemCategoriesState;
	const [, setItems] = itemsState;

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
	};

	const getInitData = async () => {
		// const items = await getAllItems();
		const items = dummyItems;
		const categories = items
			.map((item) => item.itemCategory)
			.filter((item, i, arr) => item && arr.indexOf(item) === i) as string[];
		setItemCategories(categories);
		setItems(items);
	};

	useEffect(() => {
		getInitData();
	}, []);

	return {
		itemsState,
		itemCategoriesState,
		formState,
		imagesState,
		activeStep,
		steps,
		goToNext,
		goToPrevious,
		handleRemoveImage,
		register,
		trigger,
		watch,
		setValue,
		handleSubmit
	};
};

const dummyItems: Item[] = [
	{
		itemId: 'ABC123',
		itemName: 'Beaker',
		itemImages: [],
		itemQuantity: 123,
		remainingQuantity: 12,
		itemStatus: 'pending',
		// itemCategory: 'Small',
		createdAt: new Date('2023-2-1'),
		createdBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'del',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	},
	{
		itemId: 'ABC1234',
		itemName: 'Airhorn',
		itemImages: [],
		itemQuantity: 123,
		remainingQuantity: 100,
		itemStatus: 'pending',
		createdAt: new Date('2023-2-1'),
		createdBy: {
			id: 'delpttcjBgZhHaPS5QuL',
			name: 'delasd',
			email: 'delEmail',
			status: 'pending',
			type: 'admin',
			createdAt: new Date('2023-2-1'),
			imageUrls: [
				'https://source.roboflow.com/rOZ0kQlARISe8gIXR91IT3Nva4J2/2XBcQNLJ8ApqvsAhiiuZ/original.jpg'
			]
		}
	}
];

export const AddItemContext = createContext<
	ReturnType<typeof useInitialAddItemContext> | undefined
>(undefined);

export const useAddItemContext = () => useContext(AddItemContext);
