import MainHeader from '@/components/MainHeader';
import {Flex} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';

function MainPageLayout() {
	return (
		<Flex w={'100%'} h={'100%'} flexDirection={'column'}>
			<MainHeader />
			<Flex paddingX={5} flex={1}>
				<Outlet />
			</Flex>
		</Flex>
	);
}

export default MainPageLayout;
