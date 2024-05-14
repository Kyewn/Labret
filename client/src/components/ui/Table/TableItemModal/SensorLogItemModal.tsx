import {EditableField} from '@/components/EditableField';
import {SensorLogData, formatDate} from '@/utils/const';
import {SensorLogPageContext, useSensorLogPageContext} from '@/utils/context/SensorLogPageContext';
import {Divider, Flex, HStack, Heading, Tag, VStack} from '@chakra-ui/react';
import {useContext} from 'react';

export const SensorLogItemModal: React.FC = () => {
	const sensorLogPageContext = useContext(SensorLogPageContext);
	const {
		selectedDataState: [selectedData]
	} = sensorLogPageContext as ReturnType<typeof useSensorLogPageContext>;
	const data = selectedData as SensorLogData;

	return (
		<>
			<Flex>
				<HStack>
					<Tag>DMZ</Tag>
					<Heading size={'md'}>{data.dmz_id}</Heading>
				</HStack>
			</Flex>
			<Flex flex={1} mt={5}>
				<VStack
					flex={1}
					alignItems={'flex-start'}
					spacing={10}
					flexDirection={'column'}
					paddingX={5}
					maxWidth={'unset'}
				>
					<HStack spacing={5} width={'100%'} alignItems={'flex-start'}>
						<EditableField label={'DMZ Name'} value={data.dmz_name} colKey={'dmz_name'} />
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField label={'Flow'} value={data.flow?.toString()} colKey={'flow'} />
						<EditableField
							label={'Log Date'}
							value={data.dt?.toString() && formatDate(new Date(data.dt))}
							colKey='dt'
						/>
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField
							label={'Pressure AZP'}
							value={data.pressure_azp?.toString()}
							colKey={'pressure_azp'}
						/>
						<EditableField
							label={'Pressure TP'}
							value={data.pressure_tp?.toString()}
							colKey={'pressure_tp'}
						/>
					</HStack>
				</VStack>
				<Divider orientation='vertical' />
				<VStack
					flex={1}
					alignItems={'flex-start'}
					spacing={10}
					flexDirection={'column'}
					paddingX={5}
					maxWidth={'unset'}
				>
					<HStack width={'100%'} alignItems={'flex-start'} spacing={5}>
						<EditableField
							label={'Pressure PRV Upstream'}
							colKey='pressure_prv_upstream'
							value={data.pressure_prv_upstream?.toString()}
						/>
						<EditableField
							label={'Pressure PRV Downstream'}
							colKey='pressure_prv_downstream'
							value={data.pressure_prv_downstream?.toString()}
						/>
					</HStack>
					<HStack width={'100%'} alignItems={'flex-start'} spacing={5}>
						<EditableField
							label={'Pressure PRV Upstream 2'}
							colKey='pressure_prv_upstream_2'
							value={data.pressure_prv_upstream_2?.toString()}
						/>
						<EditableField
							label={'Pressure PRV Downstream 2'}
							colKey='pressure_prv_downstream_2'
							value={data.pressure_prv_downstream_2?.toString()}
						/>
					</HStack>
					<HStack width={'100%'} alignItems={'flex-start'} spacing={5}>
						<EditableField
							label={'Pressure PRV Upstream 3'}
							colKey='pressure_prv_upstream_3'
							value={data.pressure_prv_upstream_3?.toString()}
						/>
						<EditableField
							label={'Pressure PRV Downstream 3'}
							colKey='pressure_prv_downstream_3'
							value={data.pressure_prv_downstream_3?.toString()}
						/>
					</HStack>
				</VStack>
			</Flex>
		</>
	);
};
