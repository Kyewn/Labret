import {Camera} from '@/components/ui/Camera/Camera';
import MainHeader from '@/components/ui/MainHeader';
import {useAppContext} from '@/utils/context/AppContext';
import {Box, Flex} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';

function MainPageLayout() {
	const {appState} = useAppContext();
	const {videoMode} = appState;

	return (
		<Flex position={'absolute'} w={'100%'} h={'100%'} flexDirection={'column'}>
			<MainHeader />
			<Flex flex={1} height={'90%'}>
				<Box flex={0.6} p={6}>
					<Camera videoId='mainMenuCamera' mode={videoMode} />
				</Box>
				<Outlet />
			</Flex>
		</Flex>
	);
}

export default MainPageLayout;
