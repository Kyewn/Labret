import {AlertsItemModal} from '@/components/Table/TableItemModal/AlertsItemModal';
import {RepairItemModal} from '@/components/Table/TableItemModal/RepairItemModal';
import {SensorLogItemModal} from '@/components/Table/TableItemModal/SensorLogItemModal';
import {AlertsData, RepairsData} from '@/utils/const';
import {AlertsPageContext, useAlertsPageContext} from '@/utils/context/AlertsPageContext';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {SensorLogPageContext, useSensorLogPageContext} from '@/utils/context/SensorLogPageContext';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	UseDisclosureReturn,
	useToast
} from '@chakra-ui/react';
import {useContext} from 'react';

type Props = {
	itemModalDisclosure: UseDisclosureReturn;
};

export const TableItemModal: React.FC<Props> = ({itemModalDisclosure}) => {
	const {isOpen, onClose} = itemModalDisclosure;
	const sensorLogPageContext = useContext(SensorLogPageContext);
	const repairsPageContext = useContext(RepairsPageContext);
	const alertsPageContext = useContext(AlertsPageContext);

	const currContext = sensorLogPageContext || repairsPageContext || alertsPageContext;
	const {
		refetch,
		selectedDataState: [selectedData]
	} = currContext as ReturnType<
		typeof useSensorLogPageContext | typeof useRepairsPageContext | typeof useAlertsPageContext
	>;

	const repairsMultiEditableContext = useMultiEditableContext(selectedData as RepairsData);
	const selectedAlertsData = selectedData as AlertsData;
	const toast = useToast();

	const handleItemModalClose = async () => {
		if (alertsPageContext && selectedAlertsData.status == 'unread') {
			const updateReadStatus = async () => {
				await fetch(`https://hydrorise-sentinel-j5ag.onrender.com/alerts/${selectedAlertsData.doc_id}`, {
					method: 'PUT',
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({status: 'read'})
				});
				await refetch();
			};
			toast.promise(updateReadStatus(), {
				loading: {
					description: 'Updating alert status...'
				},
				success: {
					description: 'Alert status updated!',
					duration: 3000
				},
				error: {
					description: 'Failed to update alert status, please try again.',
					duration: 3000
				}
			});
		}

		onClose();
	};

	return (
		<Modal
			scrollBehavior={'inside'}
			isOpen={isOpen}
			onClose={handleItemModalClose}
			closeOnOverlayClick={!repairsMultiEditableContext.isEditing}
		>
			<ModalOverlay />
			<ModalContent width={'unset'} minWidth={'50%'} maxWidth={'90%'} height={'90%'}>
				<ModalBody p={5} display={'flex'} flexDirection={'column'}>
					{sensorLogPageContext && <SensorLogItemModal />}
					{repairsPageContext && (
						<RepairItemModal multiEditableContext={repairsMultiEditableContext} />
					)}
					{alertsPageContext && <AlertsItemModal />}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
