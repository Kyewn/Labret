import {EditableField} from '@/components/EditableField';
import {AlertsData, formatDateAndTime} from '@/utils/const';
import {AlertsPageContext, useAlertsPageContext} from '@/utils/context/AlertsPageContext';
import {Flex, HStack, Heading, Tag, VStack} from '@chakra-ui/react';
import {useContext} from 'react';

export const AlertsItemModal: React.FC = () => {
	const alertsPageContext = useContext(AlertsPageContext);
	const {
		selectedDataState: [selectedData]
	} = alertsPageContext as ReturnType<typeof useAlertsPageContext>;
	const data = selectedData as AlertsData;

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
						<EditableField label={'Area Name'} value={data.area_name} colKey={'area_name'} />
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField label={'NRR Value'} value={data.nrr?.toString()} colKey={'nrr'} />
						<EditableField
							label={'Alert Date & Time'}
							value={data.timestamp && formatDateAndTime(new Date(data.timestamp))}
							colKey='timestamp'
						/>
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField
							label={'Description'}
							colKey='description'
							value={data.description?.toString()}
						/>
					</HStack>
				</VStack>
			</Flex>
		</>
	);
};
