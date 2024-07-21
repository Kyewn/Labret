import {EditableField} from '@/components/ui/EditableField';
import {
	useInitialVerificationTableContext,
	useVerificationTableContext
} from '@/utils/context/VerificationTableContext';
import {FormValues} from '@/utils/data';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	Checkbox,
	Flex,
	Text,
	useDisclosure,
	VStack
} from '@chakra-ui/react';
import {useRef} from 'react';
import {UseFormRegister} from 'react-hook-form';

export type ConfirmDialogProps = {
	disclosure: ReturnType<typeof useDisclosure>;
	title: string;
	description: string;
	onConfirm: () => void;
};

export const RejectConfirmDialog: React.FC<ConfirmDialogProps> = ({
	disclosure,
	title,
	description,
	onConfirm
}) => {
	const {isOpen, onClose} = disclosure;
	const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);
	const {rejectFormState} = useVerificationTableContext() as ReturnType<
		typeof useInitialVerificationTableContext
	>;
	const {watch, register} = rejectFormState;
	const {verificationComments} = watch();

	const handleClose = () => {
		onClose();
	};

	return (
		<AlertDialog isOpen={isOpen} onClose={handleClose} leastDestructiveRef={leastDestructiveRef}>
			<AlertDialogOverlay />
			<AlertDialogContent minW={'25%'} maxW={'50%'}>
				<AlertDialogHeader>{title}</AlertDialogHeader>
				<AlertDialogBody>
					<Flex>{description}</Flex>
					<VStack mt={5} alignItems={'flex-start'}>
						<Text fontWeight={700}>Optional info</Text>
						<EditableField
							useTextArea
							name={'verificationComments'}
							label='Rejection reason / comments'
							value={verificationComments}
							isEditing={true}
							register={register as UseFormRegister<FormValues>}
						/>
						<Checkbox colorScheme='lrBrown' {...register('isRecordSerious')}>
							<Text fontSize={'sm'}>Set record(s) as serious</Text>
						</Checkbox>
					</VStack>
				</AlertDialogBody>
				<AlertDialogFooter>
					<ButtonGroup>
						<Button ref={leastDestructiveRef} variant={'secondary'} onClick={handleClose}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								onConfirm();
								handleClose();
							}}
						>
							Confirm
						</Button>
					</ButtonGroup>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
