import {useAppContext} from '@/utils/context/AppContext';
import {Flex, Skeleton} from '@chakra-ui/react';

export const FaceLogin: React.FC = () => {
	const {appState} = useAppContext();
	const {videoLoading} = appState;

	if (videoLoading) {
		return (
			<Flex paddingY={7} flexDirection={'column'} flex={0.7}>
				<Skeleton w={'100%'} h={'100%'} rounded={5} />
			</Flex>
		);
	}

	return <Flex flexDirection={'column'} flex={0.7} />;
};
