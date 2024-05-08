import {LabretIcon} from '@/assets/LabretIcon';
import {paths} from '@/utils/paths';
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	Flex,
	HStack,
	IconButton,
	List,
	ListIcon,
	ListItem,
	Spacer,
	Text,
	Tooltip,
	useColorMode,
	useDisclosure
} from '@chakra-ui/react';
import {BookUser, Github, Glasses, Menu, Moon, Sun, User} from 'lucide-react';
import {Link} from 'react-router-dom';

const MainHeader: React.FC = () => {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const {colorMode, toggleColorMode} = useColorMode();
	// const {appState} = useAppContext();
	// const {user} = appState;

	return (
		<>
			<Drawer isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton position={'relative'} alignSelf={'flex-end'} />
					<DrawerBody display={'flex'} paddingX={0}>
						<List display={'flex'} flex={1} flexDirection={'column'}>
							<Link to={paths.renterSignup}>
								<ListItem>
									<ListIcon as={User} w={5} h={5} />
									<Text display={'inline-block'} fontWeight={700}>
										Register New Renter
									</Text>
								</ListItem>
							</Link>
							{/* FIXME Only when user is admin */}
							<Link to={paths.admins}>
								<ListItem>
									<ListIcon as={Glasses} w={5} h={5} />
									<Text display={'inline-block'} fontWeight={700}>
										View Admins
									</Text>
								</ListItem>
							</Link>
							{/* FIXME Only when user is locked in */}
							<Link to={paths.profile}>
								<ListItem>
									<ListIcon as={BookUser} w={5} h={5} />
									<Text display={'inline-block'} fontWeight={700}>
										View Profile
									</Text>
								</ListItem>
							</Link>
							<ListItem mt={'auto'}>
								<Link to={'https://github.com/Kyewn/Labret/'} target='_blank'>
									<ListIcon as={Github} w={5} h={5} />
									<Text display={'inline-block'} fontWeight={700}>
										Visit Project on GitHub
									</Text>
								</Link>
							</ListItem>
						</List>
					</DrawerBody>
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
};

export default MainHeader;
