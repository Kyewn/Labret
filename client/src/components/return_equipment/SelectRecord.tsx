import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {RentalRecord} from '@/utils/data';
import {formatDateAndTime} from '@/utils/utils';
import {HStack, Heading, IconButton, Text, Tooltip, VStack} from '@chakra-ui/react';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

type Props = {
	records: RentalRecord[];
};

export const SelectRecord: React.FC<Props> = ({records}) => {
	const {appState} = useAppContext();
	const {handleCloseExistingPeerConnection} = appState;
	const {goToNext, targetRecordState} = useScanContext() as ReturnType<
		typeof useInitialScanContext
	>;
	const [, setTargetRecord] = targetRecordState;
	const navigate = useNavigate();

	const handleSubHeaderBack = () => {
		handleCloseExistingPeerConnection();
		navigate(-1);
	};

	const handleRecordClick = (selectedRecord: RentalRecord) => {
		setTargetRecord(selectedRecord);
		goToNext?.();
	};

	const renderRecords = () => {
		return records.map((record, i) => (
			<VStack
				key={record.recordId}
				cursor={'pointer'}
				borderRadius={10}
				alignItems={'flex-start'}
				p={5}
				backgroundColor={'lrBrown.400'}
				_hover={{backgroundColor: 'lrBrown.700', color: 'whiteDarkMode'}}
				_active={{backgroundColor: 'lrBrown.500', color: 'whiteDarkMode'}}
				onClick={() => handleRecordClick(records[i])}
			>
				<Text fontWeight={700}>{record.recordTitle}</Text>
				<Text>{formatDateAndTime(record.rentedAt as Date)}</Text>
			</VStack>
		));
	};

	return (
		<>
			<HStack>
				<Tooltip placement='bottom' hasArrow label={'Back'}>
					<IconButton
						aria-label={'Back'}
						variant={'iconButton'}
						isRound
						icon={<ArrowLeft />}
						onClick={handleSubHeaderBack}
					/>
				</Tooltip>
				<Heading fontSize={'md'}>Return Equipment</Heading>
			</HStack>
			<VStack mt={5} spacing={5} alignItems={'flex-start'}>
				<Text fontWeight={700}>Select a record</Text>
				<VStack w={'100%'} alignItems={'stretch'}>
					{renderRecords()}
				</VStack>
			</VStack>
		</>
	);
};
