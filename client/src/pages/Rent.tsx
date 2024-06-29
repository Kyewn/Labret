import {VisionScanner} from '@/components/rent_equipment/VisionScanner';
import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {paths} from '@/utils/paths';
import {Box, Flex} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';
import {useNavigate} from 'react-router-dom';

export function Rent() {
	const {appDispatch} = useAppContext();
	const initialScanContext = useInitialScanContext();
	const {imagesState} = initialScanContext;
	const navigate = useNavigate();

	const [images] = imagesState;

	const handleScan = () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		setTimeout(() => {
			navigate(paths.sub.rentResult, {
				state: {
					images
				}
			});
			appDispatch({type: 'SET_PAGE_LOADING', payload: false});
		}, 5000);
	};

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
					<VisionScanner backLabel='Add Rent' handleScan={handleScan} />
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
