import {EditableField} from '@/components/EditableField';
import {RepairsData, formatDate} from '@/utils/const';
import {useMultiEditableContext} from '@/utils/context/MultiEditableContext';
import {RepairsPageContext, useRepairsPageContext} from '@/utils/context/RepairsPageContext';
import {Button, Divider, Flex, HStack, Spacer, Tag, VStack, useToast} from '@chakra-ui/react';
import {useContext, useState} from 'react';
import {BiCheck, BiEdit} from 'react-icons/bi';
import {IoClose} from 'react-icons/io5';

export const RepairItemModal: React.FC<{
	multiEditableContext: ReturnType<typeof useMultiEditableContext>;
}> = ({multiEditableContext}) => {
	const repairsPageContext = useContext(RepairsPageContext);
	const {refetch} = repairsPageContext as ReturnType<typeof useRepairsPageContext>;
	const data = multiEditableContext.data as RepairsData;

	const toast = useToast();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (newData: RepairsData) => {
		const fetchPutResult = fetch(`https://hydrorise-sentinel-j5ag.onrender.com/${newData.id}`, {
			method: 'PUT',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...newData,
				...(newData.dt_opened ? {dt_opened: new Date(newData.dt_opened).toISOString()} : undefined),
				...(newData.dt_closed ? {dt_closed: new Date(newData.dt_closed).toISOString()} : undefined),
				...(newData.dt_wo_creation
					? {dt_wo_creation: new Date(newData.dt_wo_creation).toISOString()}
					: undefined)
			})
		});
		setLoading(true);
		// Duplicated created due to execution in .promise behavior + multiEditableContext.onSubmit
		// Require id for toast checking
		const toastId = 'confirmEditRepairItem';
		if (!toast.isActive(toastId)) {
			toast.promise(fetchPutResult, {
				loading: {
					id: toastId,
					description: 'Saving...'
				},
				success: {
					id: toastId,
					description: 'Record has been updated!',
					duration: 3000
				},
				error: {
					id: toastId,
					description: 'Failed to save changes, please try again.',
					duration: 3000
				}
			});
		}
		await refetch();
		setLoading(false);
	};

	const getStatusColor = (status: string) => {
		const lcStatus = status.toLowerCase();
		if (lcStatus.includes('complete')) {
			return 'green';
		} else if (lcStatus.includes('cancel')) {
			return 'red';
		} else {
			return 'yellow';
		}
	};

	return (
		<>
			<Flex>
				<HStack>
					<Tag>Case number {data?.case_number}</Tag>
					{data?.status && <Tag colorScheme={getStatusColor(data.status)}>{data.status}</Tag>}
				</HStack>
				<Spacer />
				{multiEditableContext.isEditing ? (
					<HStack>
						<Button
							disabled={loading}
							variant={'secondary'}
							leftIcon={<IoClose />}
							onClick={multiEditableContext.onCancel}
						>
							Cancel
						</Button>
						<Button
							isLoading={loading}
							leftIcon={<BiCheck />}
							onClick={() => multiEditableContext.onSubmit(handleSubmit)}
						>
							Confirm
						</Button>
					</HStack>
				) : (
					<Button leftIcon={<BiEdit />} onClick={multiEditableContext.onEdit}>
						Edit
					</Button>
				)}
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
						<EditableField
							label={'Case Open Date'}
							colKey='dt_opened'
							value={data.dt_opened && formatDate(new Date(data.dt_opened))}
						/>
						<EditableField
							label={'Case Close Date'}
							colKey='dt_closed'
							value={data.dt_closed && formatDate(new Date(data.dt_closed))}
						/>
						<EditableField
							label={'W/O Creation Date'}
							colKey='dt_wo_creation'
							value={data.dt_wo_creation && formatDate(new Date(data.dt_wo_creation))}
						/>
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField
							label={'DMZ ID'}
							value={data.dmz_id}
							colKey={'dmz_id'}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
						<EditableField
							label={'Region'}
							value={data.region}
							colKey={'region'}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField
							label={'Location'}
							colKey={'location'}
							value={data.location}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					<HStack spacing={5}>
						<EditableField
							label={'Action By'}
							colKey={'action_by'}
							value={data.action_by}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					<HStack spacing={5}>
						<EditableField
							label={'Quick Comment'}
							colKey={'quick_comment'}
							value={data.quick_comment}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
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
							label={'Subject'}
							colKey='subject'
							value={data.subject}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
						<EditableField
							label={'Category'}
							colKey='subcategory'
							value={data.subcategory}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
						<EditableField
							label={'Actual Problem'}
							colKey='actual_problem'
							value={data.actual_problem}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					<HStack spacing={5} width={'100%'}>
						<EditableField
							label={'Description'}
							value={data.description}
							colKey={'description'}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					<HStack spacing={5}>
						<EditableField
							label={'Child Case Reason'}
							colKey={'child_case_reason'}
							value={data.child_case_reason}
							isEditing={multiEditableContext.isEditing}
							onChange={multiEditableContext.onChange}
						/>
					</HStack>
					{data.status?.toLowerCase().includes('complete') && (
						<HStack spacing={5}>
							<EditableField
								label={'Case resolution'}
								colKey={'case_resolution'}
								value={data.case_resolution}
								isEditing={multiEditableContext.isEditing}
								onChange={multiEditableContext.onChange}
							/>
						</HStack>
					)}
					{data.status?.toLowerCase().includes('cancel') && (
						<HStack spacing={5}>
							<EditableField
								label={'Cancelled Reason'}
								colKey={'cancelled_reason'}
								value={data.cancelled_reason}
								isEditing={multiEditableContext.isEditing}
								onChange={multiEditableContext.onChange}
							/>
							<EditableField
								label={'Other Cancelled Reasons'}
								colKey={'other_cancelled_reasons'}
								value={data.other_cancelled_reasons}
								isEditing={multiEditableContext.isEditing}
								onChange={multiEditableContext.onChange}
							/>
						</HStack>
					)}
					{data.status?.toLowerCase().includes('decline') && (
						<HStack spacing={5}>
							<EditableField
								label={'Declined Reason'}
								colKey={'declined_reason'}
								value={data.declined_reason}
								isEditing={multiEditableContext.isEditing}
								onChange={multiEditableContext.onChange}
							/>
							<EditableField
								label={'Other Declined Reasons'}
								colKey={'other_declined_reasons'}
								value={data.other_declined_reasons}
								isEditing={multiEditableContext.isEditing}
								onChange={multiEditableContext.onChange}
							/>
						</HStack>
					)}
				</VStack>
			</Flex>
		</>
	);
};
