import {VisionScanner} from '@/components/rent_equipment/VisionScanner';
import {SelectRecord} from '@/components/return_equipment/SelectRecord';
import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {ScanContext, useInitialScanContext} from '@/utils/context/ScanContext';
import {RentalRecord} from '@/utils/data';
import {paths} from '@/utils/paths';
import {Box, Flex} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import {useNavigate} from 'react-router-dom';

export function Return() {
	const {appState, appDispatch} = useAppContext();
	const {handleCloseExistingPeerConnection} = appState;
	const scanContext = useInitialScanContext();
	const {returningRecordState, activeStep, imagesState} = scanContext;
	const [records, setRecords] = useState<RentalRecord[]>([]);
	const navigate = useNavigate();
	const [returningRecord, setReturningRecord] = returningRecordState || [];

	const [images] = imagesState;

	const getUserRecords = () => {
		// TODO get user records
		setRecords([]);

		// TODO set returning record target if only 1 record
		// if (recordsResult.length > 1) {
		// 	setReturningRecord(recordsResult[0]);
		// }
	};

	useEffect(() => {
		getUserRecords();
	}, []);

	const handleScan = () => {
		appDispatch({type: 'SET_PAGE_LOADING', payload: true});
		setTimeout(() => {
			handleCloseExistingPeerConnection();
			navigate(paths.sub.returnResult, {
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
				<title>Return</title>
			</Helmet>
			<Box flex={0.6} p={6}>
				<Camera videoId='mainMenuCamera' mode={'item'} />
			</Box>
			<ScanContext.Provider value={scanContext}>
				<Flex flexDirection={'column'} flex={0.4} p={6}>
					{/* {records.length > 1 ? ( */}
					{records.length > -1 ? (
						<>
							{activeStep == 0 && <SelectRecord records={records} />}
							{activeStep == 1 && (
								<VisionScanner
									backLabel='Return Equipment'
									title={`Returning record titled: ${returningRecord?.recordTitle || 'Unknown'}`}
									handleScan={handleScan}
								/>
							)}
						</>
					) : (
						<>
							<VisionScanner
								backLabel='Return Equipment'
								title={`Returning record titled: ${returningRecord?.recordTitle || 'Unknown'}`}
								handleScan={handleScan}
							/>
						</>
					)}
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
