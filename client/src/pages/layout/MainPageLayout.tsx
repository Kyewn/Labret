import MainHeader from '@/components/ui/MainHeader';
import {Flex} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';

function MainPageLayout() {
	return (
		<Flex position={'absolute'} w={'100%'} h={'100%'} flexDirection={'column'}>
			<MainHeader />
			<Flex flex={1}>
				<Outlet />
			</Flex>
		</Flex>
	);
}

export default MainPageLayout;
