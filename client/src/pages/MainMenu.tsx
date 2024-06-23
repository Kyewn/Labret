import {FaceLogin} from '@/components/main_menu/FaceLogin';
import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {UserMenu} from '@/components/main_menu/UserMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {useAppContext} from '@/utils/context/AppContext';
import {Box, Center, Flex, Image} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';

export function MainMenu() {
	const {appState} = useAppContext();
	const {user, detectedUser, detectedUserImageURL} = appState;

	return (
		<>
			<Helmet>
				<title>Main menu</title>
			</Helmet>
			<Box flex={0.6} p={6}>
				{detectedUser ? (
					<Center w={'100%'} h={'100%'}>
						<Image src={detectedUserImageURL as string} alt={'Detected user'} />
					</Center>
				) : user ? (
					<Camera videoId='mainMenuNormalCamera' mode={'face'} useNormalMode />
				) : (
					<Camera videoId='mainMenuCamera' mode={'face'} />
				)}
			</Box>
			<Flex flexDirection={'column'} flex={0.4} p={6}>
				{user ? <UserMenu /> : <FaceLogin />}
				<PublicMenu />
			</Flex>
		</>
	);
}
