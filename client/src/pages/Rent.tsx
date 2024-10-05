import {VisionScanner} from '@/components/rent_equipment/VisionScanner';
import {Camera} from '@/components/ui/Camera/Camera';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {paths} from '@/utils/paths';
import {Box, Flex} from '@chakra-ui/react';
import {useEffect} from 'react';
import {Helmet} from 'react-helmet-async';
import {useNavigate} from 'react-router-dom';

export function Rent() {
	const initialScanContext = useInitialScanContext();
	const {readyToRedirectState, imagesState, scanResultState, handleScan} = initialScanContext;
	const [readyToRedirect] = readyToRedirectState;
	const [images] = imagesState;
	const [scanResult] = scanResultState;
	const navigate = useNavigate();

	useEffect(() => {
		if (readyToRedirect) {
			navigate(paths.sub.rentResult, {
				state: {
					images,
					scanResult
				}
			});
		}
	}, [readyToRedirect]);

	return (
		<>
			<Helmet>
				<title>Rent</title>
			</Helmet>
			<Box flex={0.6} p={6}>
				<Camera videoId='mainMenuCamera' mode={'item'} />
			</Box>
			<ScanContext.Provider value={initialScanContext}>
				<Flex flexDirection={'column'} flex={0.4} p={6}>
					<VisionScanner backLabel='Add Rent' handleScan={() => handleScan('rent')} />
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
