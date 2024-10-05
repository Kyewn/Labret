import {ImageGallery} from '@/components/rent_equipment/ImageGallery';
import {EditReturnScanResult} from '@/components/return_equipment/EditReturnScanResult';
import {ReturnForm} from '@/components/return_equipment/ReturnForm';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {RentalRecord, RentingItem} from '@/utils/data';
import {
	Box,
	Flex,
	Heading,
	Spacer,
	Step,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Text
} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useLocation} from 'react-router-dom';

type LocationState = {
	images: Blob[];
	scanResult: RentingItem[];
	targetRecord: RentalRecord;
};

export function ReturnScanResult() {
	const {appState} = useAppContext();
	const location = useLocation();
	const scanContext = useInitialScanContext() as ReturnType<typeof useInitialScanContext>;
	const {user} = appState;
	const {images, scanResult, targetRecord} = location.state as LocationState;
	const {returnSteps, activeStep, scanResultState, targetRecordState} = scanContext;
	const [, setNewScanResult] = scanResultState;
	const [, setTargetRecord] = targetRecordState;
	const dummyItems: RentingItem[] = [
		{
			item: {
				itemId: 'ABC123',
				itemName: 'Beaker',
				itemImages: [],
				itemQuantity: 123,
				createdAt: new Date(),
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
				},
				itemStatus: 'pending'
			},
			rentQuantity: 2
		},
		{
			item: {
				itemId: 'AC123',
				itemName: 'Balls',
				itemImages: [],
				itemQuantity: 1223,
				createdAt: new Date(),
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
				},
				itemStatus: 'pending'
			},
			rentQuantity: 5
		},
		{
			item: {
				itemId: 'A1333',
				itemName: 'Cups',
				itemImages: [],
				itemQuantity: 12,
				createdAt: new Date(),
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
				},
				itemStatus: 'pending'
			},
			rentQuantity: 3
		}
	];

	useEffect(() => {
		// FIXME:
		// setNewScanResult(scanResult);
		setNewScanResult(dummyItems);
		setTargetRecord(targetRecord);
		// TODO
		// setImageProofs(imageUrls from scanResult)
	}, []);

	return (
		<>
			<Helmet>
				<title>Rent</title>
			</Helmet>
			<ScanContext.Provider value={scanContext}>
				<Flex flex={1} h={'100%'}>
					<Flex flex={0.5}>
						<ImageGallery images={images} />
					</Flex>
					<Flex flex={0.5} flexDirection={'column'} paddingX={5}>
						<Flex w={'100%'} alignItems={'center'}>
							<Heading fontSize={'1.5rem'} paddingY={5}>
								Return equipment
							</Heading>
							<Spacer />
							<Text>{user?.name || 'Brian'}</Text>
						</Flex>
						<Flex />
						<Flex>
							<Stepper index={activeStep} flex={0.5}>
								{returnSteps.map((step, index) => (
									<Step key={index}>
										<StepIndicator>
											<StepStatus
												complete={<StepIcon />}
												incomplete={<StepNumber />}
												active={<StepNumber />}
											/>
										</StepIndicator>

										<Box flexShrink='0'>
											<StepTitle>{step.title}</StepTitle>
										</Box>

										<StepSeparator />
									</Step>
								))}
							</Stepper>
						</Flex>
						{activeStep == 0 && <EditReturnScanResult />}
						{activeStep == 1 && <ReturnForm />}
					</Flex>
				</Flex>
			</ScanContext.Provider>
		</>
	);
}