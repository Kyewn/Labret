import {LabretIcon} from '@/assets/LabretIcon';
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Flex,
	HStack,
	IconButton,
	Spacer,
	Tooltip,
	useColorMode,
	useDisclosure
} from '@chakra-ui/react';
import {Menu, Moon, Sun} from 'lucide-react';

function MainHeader() {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const {colorMode, toggleColorMode} = useColorMode();

	return (
		<>
			<Drawer isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerBody>{<p>Pee pee poo poo</p>}</DrawerBody>
				</DrawerContent>
			</Drawer>
			<Flex
				paddingX={5}
				paddingY={2}
				boxShadow={
					colorMode == 'dark'
						? '0 0 8px 0 var(--chakra-colors-gray-300)'
						: '0 0 8px 0 var(--chakra-colors-gray-500)'
				}
			>
				<LabretIcon w={150} h={'100%'} fill={colorMode == 'dark' ? 'white' : 'black'} />
				<Spacer />
				<HStack spacing={'5'}>
					<Tooltip label={colorMode == 'dark' ? 'Toggle Light Mode' : 'Toggle Night Mode'} hasArrow>
						<IconButton
							aria-label={'Night Mode'}
							variant={'iconButton'}
							isRound
							icon={colorMode == 'dark' ? <Sun /> : <Moon />}
							onClick={toggleColorMode}
						/>
					</Tooltip>
					<Tooltip label='More User Actions' hasArrow>
						<IconButton
							aria-label={'Menu'}
							variant={'iconButton'}
							isRound
							icon={<Menu />}
							onClick={onOpen}
						/>
					</Tooltip>
				</HStack>
			</Flex>
		</>
	);
}

export default MainHeader;
