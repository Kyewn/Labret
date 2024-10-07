import {EditRentScanResult} from '@/components/rent_equipment/EditRentScanResult';
import {ImageGallery} from '@/components/rent_equipment/ImageGallery';
import {RentForm} from '@/components/rent_equipment/RentForm';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {RentingItem} from '@/utils/data';
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
	scanResult: RentingItem[];
	images: Blob[];
};

export function RentScanResult() {
	const {appState} = useAppContext();
	const location = useLocation();
	const scanContext = useInitialScanContext() as ReturnType<typeof useInitialScanContext>;
	const {user} = appState;
	const {scanResultState, imagesState, rentSteps, activeStep} = scanContext;
	const {images: images_temp, scanResult} = location.state as LocationState;

	const [images, setImages] = imagesState;
	const [, setNewScanResult] = scanResultState;

	useEffect(() => {
		setImages(images_temp);
		setNewScanResult(scanResult);
	}, []);

	return (
		<>
			<Helmet>
				<title>Rent</title>
			</Helmet>
			<ScanContext.Provider value={scanContext}>
				<Flex flex={1} h={'100%'}>
					<Flex flex={0.5}>
						<ImageGallery images={images as Blob[]} />
					</Flex>
					<Flex flex={0.5} flexDirection={'column'} paddingX={5}>
						<Flex w={'100%'} alignItems={'center'}>
							<Heading fontSize={'1.5rem'} paddingY={5}>
								New Rent
							</Heading>
							<Spacer />
							<Text>{user?.name || 'Brian'}</Text>
						</Flex>
						<Flex />
						<Flex>
							<Stepper index={activeStep} flex={0.5}>
								{rentSteps.map((step, index) => (
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
						{activeStep == 0 && <EditRentScanResult />}
						{activeStep == 1 && <RentForm />}
					</Flex>
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
