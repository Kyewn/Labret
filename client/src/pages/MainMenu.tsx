import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {UserMenu} from '@/components/main_menu/UserMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {Box, Flex} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';

export function MainMenu() {
	// const {appState} = useAppContext();
	// const {user} = appState;

	return (
		<>
			<Helmet>
				<title>Main menu</title>
			</Helmet>
			<Box flex={0.6} p={6}>
				<Camera videoId='mainMenuCamera' mode={'face'} />
			</Box>
			<Flex flexDirection={'column'} flex={0.4} p={6}>
				{
					// If user logged in and locked
					// user ? <UserMenu /> : <FaceLogin />
					<UserMenu />
				}

				<PublicMenu />
			</Flex>
		</>
	);
}
