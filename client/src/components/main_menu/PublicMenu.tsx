import {Button, Heading, VStack} from '@chakra-ui/react';
import {History, Microscope} from 'lucide-react';

export const PublicMenu: React.FC = () => {
	return (
		<VStack spacing={5} flex={0.3}>
			<Heading size={'xs'} alignSelf={'flex-start'} color={'lrBrown.400'}>
				Public Menu
			</Heading>
			<VStack w={'100%'} spacing={3} alignItems={'stretch'}>
				<Button variant={'outline'} leftIcon={<History />}>
					Public History
				</Button>
				<Button variant={'outline'} leftIcon={<Microscope />}>
					Equipment Availability
				</Button>
			</VStack>
		</VStack>
	);
};
