import {AlertsFilters} from '@/components/Table/Filters/AlertsFilters';
import {RepairFilters} from '@/components/Table/Filters/RepairsFilters';
import {SensorLogFilters} from '@/components/Table/Filters/SensorLogFilters';
import {TableItemModal} from '@/components/Table/TableItemModal/TableItemModal';
import {AlertsData, RepairsData, SensorLogData, formatDate, formatDateAndTime} from '@/utils/const';
import {AlertsPageContext, useAlertsPageContext} from '@/utils/context/AlertsPageContext';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {SensorLogPageContext, useSensorLogPageContext} from '@/utils/context/SensorLogPageContext';
import {
	Button,
	Center,
	Flex,
	HStack,
	Heading,
	Icon,
	Spinner,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure
} from '@chakra-ui/react';
import {useContext} from 'react';
import {FiArrowDown, FiArrowUp} from 'react-icons/fi';
import {GrDocumentMissing} from 'react-icons/gr';
import './Table.css';

export type TablePage = 'repair' | 'alerts' | 'sensorLog';
export type TableData = RepairsData | SensorLogData;

const TableConfigBar: React.FC = () => {
	const sensorLogPageContext = useContext(SensorLogPageContext);
	const repairsPageContext = useContext(RepairsPageContext);
	const alertsPageContext = useContext(AlertsPageContext);

	return (
		<HStack>
			{repairsPageContext && <RepairFilters />}
			{sensorLogPageContext && <SensorLogFilters />}
			{alertsPageContext && <AlertsFilters />}
		</HStack>
	);
};

const TablePane: React.FC = () => {
	const sensorLogPageContext = useContext(SensorLogPageContext);
	const repairsPageContext = useContext(RepairsPageContext);
	const alertsPageContext = useContext(AlertsPageContext);
	const itemModalDisclosure = useDisclosure();

	const currContext = sensorLogPageContext || repairsPageContext || alertsPageContext;
	const {data, tableColumns, orderBy, handleOrderBy, isFilterOrOrderLoading, selectedDataState} =
		currContext as ReturnType<
			typeof useSensorLogPageContext | typeof useRepairsPageContext | typeof useAlertsPageContext
		>;
	const [, setSelectedRepairsData] = selectedDataState as [
		RepairsData | undefined,
		React.Dispatch<React.SetStateAction<RepairsData | undefined>>
	];
	const [, setSelectedSensorLogData] = selectedDataState as [
		SensorLogData | undefined,
		React.Dispatch<React.SetStateAction<SensorLogData | undefined>>
	];
	const [, setSelectedAlertData] = selectedDataState as [
		AlertsData | undefined,
		React.Dispatch<React.SetStateAction<AlertsData | undefined>>
	];

	const populateColumns = (): React.ReactNode =>
		Object.entries(tableColumns).map(([dbColumn, column], i) => (
			<Th p={0} key={`${column}${i}`}>
				<Button
					variant={'tableHeader'}
					onClick={() => handleOrderBy(column)}
					rightIcon={
						orderBy[dbColumn] ? (
							orderBy[dbColumn] == 'asc' ? (
								<FiArrowDown />
							) : (
								<FiArrowUp />
							)
						) : undefined
					}
					width={'100%'}
					m={0}
				>
					{column}
				</Button>
			</Th>
		));
	const populateData = (): React.ReactNode => {
		if (sensorLogPageContext) {
			return (data as SensorLogData[]).map((record, i) => (
				<Tr
					key={`${record.dmz_id}${i}`}
					onClick={() => {
						setSelectedSensorLogData(() => {
							itemModalDisclosure.onOpen();
							return record;
						});
					}}
				>
					<Td>{record.dmz_id}</Td>
					<Td>{record.dmz_name}</Td>
					<Td>{record.dt ? formatDate(new Date(record.dt)) : 'No Date'}</Td>
					<Td>{record.pressure_tp}</Td>
					<Td>{record.pressure_azp}</Td>
					<Td>{record.flow}</Td>
				</Tr>
			));
		} else if (repairsPageContext) {
			return (data as RepairsData[]).map((record) => (
				<Tr
					key={record.id}
					onClick={() => {
						setSelectedRepairsData(() => {
							itemModalDisclosure.onOpen();
							return record;
						});
					}}
				>
					<Td>{record.case_number}</Td>
					<Td>{record.dmz_id}</Td>
					<Td>{record.region}</Td>
					<Td>{record.location}</Td>
					<Td>{record.action_by}</Td>
					<Td>{record.status}</Td>
					<Td>{record.dt_opened ? formatDate(new Date(record.dt_opened)) : 'No Date'}</Td>
					<Td>{record.dt_closed ? formatDate(new Date(record.dt_closed)) : 'No Date'}</Td>
					<Td>{record.subcategory}</Td>
				</Tr>
			));
		} else if (alertsPageContext) {
			return (data as AlertsData[]).map((record) => (
				<Tr
					key={record.doc_id}
					onClick={() => {
						setSelectedAlertData(() => {
							itemModalDisclosure.onOpen();
							return record;
						});
					}}
				>
					<Td>{record.dmz_id}</Td>
					<Td>{record.dmz_name}</Td>
					<Td>{record.area_name}</Td>
					<Td>{record.nrr}</Td>
					<Td>{`${record.status?.[0].toUpperCase()}${record.status?.slice(1)}`}</Td>
					<Td>{record.timestamp ? formatDateAndTime(new Date(record.timestamp)) : 'No Date'}</Td>
				</Tr>
			));
		}
	};

	return (
		<>
			<TableItemModal itemModalDisclosure={itemModalDisclosure} />
			<TableContainer flex={1} mt={5} overflowX={'auto'} overflowY={'auto'}>
				{isFilterOrOrderLoading ? (
					<Table height={'100%'} variant={'simple'}>
						<Thead>
							<Tr>{populateColumns()}</Tr>
						</Thead>
						<Tbody height={'100%'}>
							<Tr className='tr-no-data'>
								<Td colSpan={Object.entries(tableColumns).length}>
									<Center flexDirection={'column'}>
										<Spinner />
									</Center>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				) : data?.length ? (
					<Table variant={'simple'}>
						<Thead>
							<Tr>{populateColumns()}</Tr>
						</Thead>
						<Tbody>{populateData()}</Tbody>
					</Table>
				) : (
					<Table height={'100%'} variant={'simple'}>
						<Thead>
							<Tr>{populateColumns()}</Tr>
						</Thead>
						<Tbody height={'100%'}>
							<Tr className='tr-no-data'>
								<Td colSpan={Object.entries(tableColumns).length}>
									<Center flexDirection={'column'}>
										<Icon as={GrDocumentMissing} w={10} h={10} mb={2} />
										<Heading size={'md'}>No Available Data</Heading>
									</Center>
								</Td>
							</Tr>
						</Tbody>
					</Table>
				)}
			</TableContainer>
		</>
	);
};

export const TableGroup: React.FC = () => {
	return (
		<>
			<Flex flex={1} overflow={'hidden'} flexDirection={'column'}>
				<TableConfigBar />
				<TablePane />
			</Flex>
		</>
	);
};
