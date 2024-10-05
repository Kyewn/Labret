import {ItemTable} from '@/components/view_items/ItemTable';
import {ItemTableItemModal} from '@/components/view_items/ItemTableItemModal';
import {useAppContext} from '@/utils/context/AppContext';
import {ItemTableContext, useInitialItemTableContext} from '@/utils/context/ItemTableContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {paths} from '@/utils/paths';
import {Button, Divider, Flex, Heading, HStack, Spacer, Tooltip, useToast} from '@chakra-ui/react';
import {Plus} from 'lucide-react';
import {useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {Link} from 'react-router-dom';

export function ViewItems() {
	const {appDispatch} = useAppContext();
	const itemTableContext = useInitialItemTableContext() as ReturnType<
		typeof useInitialItemTableContext
	>;
	const {selectedDataState, infoDisclosure} = itemTableContext;
	const [selectedData] = selectedDataState;
	const multiEditableContext = useMultiEditableContext(selectedData);
	const toast = useToast();
	const [isAnnotationButtonClicked, setIsAnnotationButtonClicked] = useState(false);

	const handleTrainModel = async () => {
		try {
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'training'
			});
			appDispatch({type: 'SET_PAGE_LOADING', payload: true});
			const result = await fetch('http://localhost:8000/train-item-lts-model');

			// if (result > 0.7) {
			// 	toast({
			// 		title: 'Model training successful',
			// 		description: 'Model mAP:',
			// 		status: 'success'
			// 	});
			// } else {
			// 	toast({
			// 		title: 'Model training insufficient',
			// 		description: 'Model mAP:',
			// 		status: 'info'
			// 	});
			// }

			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'default'
			});
		} catch {
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
			appDispatch({
				type: 'SET_PAGE_LOADING_LABEL_TYPE',
				payload: 'default'
			});
			toast({
				title: 'Training interrupted',
				description: 'Something went wrong during face training, please try again.',
				status: 'error'
			});
		}
	};

	return (
		<>
			<Helmet>
				<title>View Items</title>
			</Helmet>
			<ItemTableContext.Provider value={itemTableContext}>
				<ItemTableItemModal
					disclosure={infoDisclosure}
					multiEditableContext={multiEditableContext}
				/>

				<Flex flex={1} flexDirection={'column'} justifyContent={'center'} p={3} paddingX={10}>
					<Flex marginY={3} alignItems={'center'}>
						<HStack spacing={5}>
							<Heading size={'md'}>Items</Heading>
							<Link to={paths.sub.addItem}>
								<Button leftIcon={<Plus />}>Add Item</Button>
							</Link>
						</HStack>
						<Spacer />
						<HStack>
							<Tooltip
								hasArrow
								label={
									'Label item images for AI model in Roboflow. Publish a new version after all new annotations are completed'
								}
								placement='bottom-start'
								borderRadius={5}
							>
								<Link
									style={{width: 'unset'}}
									to={'https://app.roboflow.com/oowus-workspace/labret-face/annotate'}
									target='_blank'
									onClick={() => setIsAnnotationButtonClicked(true)}
								>
									<Button variant={'outline'}>Check Annotations</Button>
								</Link>
							</Tooltip>
							<Tooltip
								hasArrow
								label={
									'Enable after checking annotations. Item detection model needs to be updated everytime new items are added and after a new Roboflow version is published.'
								}
								placement='bottom-start'
								borderRadius={5}
							>
								<Button isDisabled={!isAnnotationButtonClicked} onClick={handleTrainModel}>
									Retrain item model
								</Button>
							</Tooltip>
						</HStack>
					</Flex>
					<Divider orientation='horizontal' />
					<ItemTable />
				</Flex>
			</ItemTableContext.Provider>
		</>
	);
}
