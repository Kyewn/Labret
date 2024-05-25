import '@/App.css';
import SubHeader from '@/components/ui/SubHeader';
import {Flex} from '@chakra-ui/react';
import {Outlet} from 'react-router-dom';

function SubPageLayout() {
	return (
		<Flex position={'absolute'} w={'100%'} h={'100%'} flexDirection={'column'}>
			<SubHeader />
			<Flex flex={1} flexDirection={'column'} overflow={'auto'}>
				<Outlet />
			</Flex>
		</Flex>
	);
}

export default SubPageLayout;
