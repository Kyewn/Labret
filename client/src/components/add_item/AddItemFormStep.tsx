import {EditableComboBox} from '@/components/ui/EditableComboBox';
import {EditableField} from '@/components/ui/EditableField';
import {EditableNumberInput} from '@/components/ui/EditableNumberInput';
import ImageManager from '@/components/ui/ImageManager';
import {createItem, editItem} from '@/db/item';
import {useAddItemContext, useInitialAddItemContext} from '@/utils/context/AddItemContext';
import {useAppContext} from '@/utils/context/AppContext';
import {AddItemFormValues, FormValues} from '@/utils/data';
import {paths} from '@/utils/paths';
import {convertBlobToBase64} from '@/utils/utils';
import {Button, ButtonGroup, Flex, HStack, Spacer, VStack, useToast} from '@chakra-ui/react';
import {getDoc} from 'firebase/firestore';
import {useEffect} from 'react';
import {UseFormRegister, UseFormSetValue} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

type ImageInfo = {
	image: {
		id: string;
		urls: {
			original: string;
		};
	};
};

const AddItemFormStep: React.FC = () => {
	const {appState, appDispatch} = useAppContext();
	const {user: appUser} = appState;
	const {
		itemsState,
		itemCategoriesState,
		imagesState,
		formState: {isSubmitting, errors},
		register,
		watch,
		setValue,
		handleSubmit,
		goToPrevious
	} = useAddItemContext() as ReturnType<typeof useInitialAddItemContext>;
	const [images] = imagesState;
	const [items] = itemsState;
	const [itemCategories] = itemCategoriesState;
	const toast = useToast();
	const navigate = useNavigate();
	const {itemName, itemQuantity, itemCategory, itemDescription} = watch();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	const handleCreateItem = async (data: AddItemFormValues) => {
		// Create firebase user
		const existingItem = items.find((item) => item.itemName === data.itemName.toLowerCase().trim());
		if (existingItem) {
			const ItemAlreadyExistsError = new Error();
			ItemAlreadyExistsError.name = 'UserAlreadyExists';
			throw ItemAlreadyExistsError;
		}

		const item = await createItem(data, appUser?.id as string);
		const itemData = (await getDoc(item)).data() as AddItemFormValues;
		// Convert images to base64 strings
		const imageStrings = await Promise.all(
			images.map(async (img) => {
				const base64String = await convertBlobToBase64(img);
				return base64String;
			})
		);
		// Send user data to backend for ultralytics pipeline
		const uploadRes = await fetch('http://localhost:8000/add-item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				id: item.id,
				images: imageStrings,
				...itemData
			})
		});

		const resJson = await uploadRes.json();
		const imageUrls = (resJson.uploadedImageInfos as ImageInfo[]).map((info) => {
			const originalUrl = info.image.urls.original;
			return originalUrl.replace('undefined', info.image.id);
		});
		await editItem(item.id, {itemImages: imageUrls});
	};

	const onSubmit = async (data: AddItemFormValues) => {
		try {
			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: true
			});
			await handleCreateItem(data);

			// TODODEV: Remove when backend is ready
			// const a = document.createElement('a');
			// for (const img of images) {
			// 	const imgURL = URL.createObjectURL(img);
			// 	a.href = imgURL;
			// 	a.download = 'image';
			// 	a.click();
			// 	URL.revokeObjectURL(imgURL);
			// }

			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: false
			});
			navigate(paths.sub.items);
			toast({
				title: 'Success',
				description: 'Item creation request has been sent for review.',
				status: 'success',
				duration: 5000,
				isClosable: true
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log(err);
			appDispatch({
				type: 'SET_PAGE_LOADING',
				payload: false
			});

			switch (err.name) {
				case 'ItemAlreadyExists':
					toast({
						title: 'Error',
						description: 'Item already exists. Please try again.',
						status: 'error',
						duration: 5000,
						isClosable: true
					});
					break;
				default:
					toast({
						title: 'Error',
						description: 'Failed to create item. Please try again.',
						status: 'error',
						duration: 5000,
						isClosable: true
					});
			}
		}
	};

	return (
		<>
			<Flex flex={0.9} paddingX={10} pb={10}>
				<VStack flex={1} w={'100%'}>
					<form id='form' onSubmit={handleSubmit(onSubmit)} style={{flex: 1}}>
						<VStack spacing={5} width={'100%'} alignItems={'flex-start'}>
							<Flex width={'100%'}>
								<VStack spacing={5} height={'100%'} flex={1} alignItems={'center'}>
									<HStack
										flex={1}
										h={'100%'}
										spacing={20}
										alignItems={'flex-start'}
										justifyItems={'flex-start'}
									>
										<VStack
											h={'100%'}
											flex={1}
											alignItems={'flex-start'}
											justifyItems={'flex-start'}
										>
											<EditableField
												name='itemName'
												label={'Label'}
												value={itemName}
												isEditing
												register={register as UseFormRegister<FormValues>}
												rules={{required: 'Label is required'}}
												errorMessage={errors.itemName?.message}
											/>
											<EditableField
												useTextArea
												name='itemDescription'
												label={'Description'}
												value={itemDescription}
												isEditing
												register={register as UseFormRegister<FormValues>}
											/>
										</VStack>
										<VStack
											h={'100%'}
											flex={1}
											alignItems={'flex-start'}
											justifyItems={'flex-start'}
										>
											<EditableNumberInput
												name='itemQuantity'
												label={'Quantity'}
												min={1}
												value={(itemQuantity as number) || 1}
												isEditing
												register={register as UseFormRegister<FormValues>}
												handleChange={(_, value) => setValue('itemQuantity', value)}
											/>

											<EditableComboBox
												isClearEnabled
												isCreateNewOnNoneEnabled
												name='itemCategory'
												label={'Category'}
												placeholder='Choose or add category'
												items={itemCategories}
												value={itemCategory}
												isEditing
												setValue={setValue as UseFormSetValue<FormValues>}
											/>
										</VStack>
									</HStack>
								</VStack>
							</Flex>
							<ImageManager label='Item images' specifiedImages={images} />
						</VStack>
					</form>

					<HStack width={'100%'}>
						<ButtonGroup width={'100%'}>
							<Button variant={'outline'} onClick={goToPrevious}>
								Back
							</Button>
							<Spacer />
							<Button form='form' type='submit' isLoading={isSubmitting}>
								Add Item
							</Button>
						</ButtonGroup>
					</HStack>
				</VStack>
			</Flex>
		</>
	);
};

export default AddItemFormStep;
