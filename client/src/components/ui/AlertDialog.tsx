import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	useDisclosure
} from '@chakra-ui/react';
import {useRef} from 'react';

type Props = {
	disclosure: ReturnType<typeof useDisclosure>;
	title: string;
	description: string;
	onConfirm: () => void;
};

export const ConfirmDialog: React.FC<Props> = ({disclosure, title, description, onConfirm}) => {
	const {isOpen, onClose} = disclosure;
	const leastDestructiveRef = useRef<HTMLButtonElement | null>(null);

	return (
		<AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={leastDestructiveRef}>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>{title}</AlertDialogHeader>
				<AlertDialogBody>{description}</AlertDialogBody>
				<AlertDialogFooter>
					<ButtonGroup>
						<Button ref={leastDestructiveRef} variant={'secondary'} onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								onConfirm();
								onClose();
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
