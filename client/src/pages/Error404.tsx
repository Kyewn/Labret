import {Center, Heading, Text} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';

export const Error404 = () => {
	return (
		<>
			<Helmet>
				<title>404 - Not Found</title>
			</Helmet>
			<Center h={'100%'} flexDirection={'column'} alignItems={'center'}>
				<Heading>Route not found</Heading>
				<Text fontSize={'md'}>Are you sure you are on the right page?</Text>
			</Center>
		</>
	);
};
