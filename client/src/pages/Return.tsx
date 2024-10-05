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
	const {
		appState: {handleCloseExistingPeerConnection}
	} = useAppContext();
	const scanContext = useInitialScanContext();
	const {
		readyToRedirectState,
		imagesState,
		scanResultState,
		targetRecordState,
		activeStep,
		handleScan
	} = scanContext;
	const [records, setRecords] = useState<RentalRecord[]>([]);
	const [targetRecord] = targetRecordState || [];
	const [readyToRedirect] = readyToRedirectState;
	const [images] = imagesState;
	const [scanResult] = scanResultState;
	const navigate = useNavigate();

	useEffect(() => {
		if (readyToRedirect) {
			handleCloseExistingPeerConnection();
			navigate(paths.sub.returnResult, {
				state: {
					images,
					targetRecord,
					scanResult
				}
			});
		}
	}, [readyToRedirect]);

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
									title={`Returning record titled: ${targetRecord?.recordTitle || 'Unknown'}`}
									handleScan={() => handleScan('return')}
								/>
							)}
						</>
					) : (
						<>
							<VisionScanner
								backLabel='Return Equipment'
								title={`Returning record titled: ${targetRecord?.recordTitle || 'Unknown'}`}
								handleScan={() => handleScan('return')}
							/>
						</>
					)}
				</Flex>
			</ScanContext.Provider>
		</>
	);
}
