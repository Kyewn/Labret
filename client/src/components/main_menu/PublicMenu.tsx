import '@/App.css';
import {useAppContext} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {Button, Heading, VStack} from '@chakra-ui/react';
import {History, Microscope} from 'lucide-react';
import {Link} from 'react-router-dom';

export const PublicMenu: React.FC = () => {
	const {appState} = useAppContext();
	const {handleCloseExistingPeerConnection} = appState;

	const handleCloseMainMenuCamera = () => {
		handleCloseExistingPeerConnection?.();
	};

	return (
		<VStack spacing={5} flex={0.3}>
			<Heading size={'xs'} alignSelf={'flex-start'} color={'lrBrown.400'}>
				Public Menu
			</Heading>
			<VStack w={'100%'} spacing={3}>
				<Link to={paths.sub.publicHistory} onClick={handleCloseMainMenuCamera}>
					<Button variant={'outline'} leftIcon={<History />}>
						Public History
					</Button>
				</Link>
				<Link to={paths.sub.equipmentAvailability} onClick={handleCloseMainMenuCamera}>
					<Button variant={'outline'} leftIcon={<Microscope />}>
						Equipment Availability
					</Button>
				</Link>
			</VStack>
		</VStack>
	);
};
