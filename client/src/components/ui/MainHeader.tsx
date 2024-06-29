import '@/App.css';
import {LabretIcon} from '@/assets/LabretIcon';
import {useAppContext} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {CardList, themes} from '@/utils/themes';
import {
	ChakraProvider,
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
	extendTheme,
	useColorMode,
	useDisclosure
} from '@chakra-ui/react';
import {BookUser, Github, Glasses, Menu, Moon, Sun, User, UserCog2} from 'lucide-react';
import {Link} from 'react-router-dom';

const localTheme = extendTheme(themes, {
	components: {
		List: CardList
	}
});

const MainHeader: React.FC = () => {
	const {isOpen, onClose, onOpen} = useDisclosure();
	const {colorMode, toggleColorMode} = useColorMode();
	const {appState} = useAppContext();

	const {handleCloseExistingPeerConnection} = appState;

	const handleCloseMainMenuCamera = () => {
		handleCloseExistingPeerConnection?.();
	};

	return (
		<>
			<ChakraProvider theme={localTheme}>
				<Drawer isOpen={isOpen} onClose={onClose} closeOnOverlayClick>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton position={'relative'} alignSelf={'flex-end'} />
						<DrawerBody display={'flex'} paddingX={0}>
							<List display={'flex'} flex={1} flexDirection={'column'}>
								<Link to={paths.sub.register} onClick={handleCloseMainMenuCamera}>
									<ListItem>
										<ListIcon as={User} w={5} h={5} />
										<Text display={'inline-block'} fontWeight={700}>
											Register
										</Text>
									</ListItem>
								</Link>
								{/* FIXME Only when user is admin */}
								<Link to={paths.sub.registerAdmin} onClick={handleCloseMainMenuCamera}>
									<ListItem>
										<ListIcon as={UserCog2} w={5} h={5} />
										<Text display={'inline-block'} fontWeight={700}>
											Register Admin
										</Text>
									</ListItem>
								</Link>
								{/* FIXME Only when user is locked in */}
								<Link to={paths.sub.users} onClick={handleCloseMainMenuCamera}>
									<ListItem>
										<ListIcon as={BookUser} w={5} h={5} />
										<Text display={'inline-block'} fontWeight={700}>
											View Users
										</Text>
									</ListItem>
								</Link>
								{/* FIXME Only when user is admin */}
								<Link to={paths.sub.admins} onClick={handleCloseMainMenuCamera}>
									<ListItem>
										<ListIcon as={Glasses} w={5} h={5} />
										<Text display={'inline-block'} fontWeight={700}>
											View Admins
										</Text>
									</ListItem>
								</Link>
								<Link
									to={'https://github.com/Kyewn/Labret/'}
									target='_blank'
									style={{marginTop: 'auto'}}
								>
									<ListItem>
										<ListIcon as={Github} w={5} h={5} />
										<Text display={'inline-block'} fontWeight={700}>
											Visit Project on GitHub
										</Text>
									</ListItem>
								</Link>
							</List>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			</ChakraProvider>
			<Flex
				paddingX={5}
				paddingY={2}
				boxShadow={
					colorMode == 'dark'
						? '0 0 8px 0 var(--chakra-colors-gray-300)'
						: '0 0 8px 0 var(--chakra-colors-gray-500)'
				}
				height={'10%'}
			>
				<Link style={{width: 'auto'}} to={paths.main.root} onClick={handleCloseMainMenuCamera}>
					<LabretIcon w={150} h={'unset'} fill={colorMode == 'dark' ? 'white' : 'black'} />
				</Link>
				<Spacer />
				<HStack spacing={'5'}>
					<Tooltip label={colorMode == 'dark' ? 'Toggle Light Mode' : 'Toggle Night Mode'}>
						<IconButton
							aria-label={'Night Mode'}
							variant={'iconButton'}
							isRound
							icon={colorMode == 'dark' ? <Sun /> : <Moon />}
							onClick={toggleColorMode}
						/>
					</Tooltip>
					<Tooltip label='More User Actions'>
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
