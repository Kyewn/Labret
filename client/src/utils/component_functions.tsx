import {Heading, Text, VStack} from '@chakra-ui/react';

export const getLoadingLabelComponent = (labelType: string) => {
	if (labelType == 'training') {
		return (
			<>
				<VStack zIndex={100}>
					<Heading fontSize={'sm'} color={'white'}>
						Training...
					</Heading>
					<Text fontSize={'sm'} fontWeight={700} color={'white'}>
						This could take awhile and this page should be left running, we will notify you once it
						is finished.
					</Text>
				</VStack>
			</>
		);
	} else {
		return (
			<Heading fontSize={'sm'} color={'white'} zIndex={100}>
				Loading...
			</Heading>
		);
	}
};
