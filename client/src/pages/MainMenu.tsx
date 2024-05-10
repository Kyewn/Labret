import {FaceLogin} from '@/components/main_menu/FaceLogin';
import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {Box, Flex} from '@chakra-ui/react';
import {useState} from 'react';

export function MainMenu() {
	const [mode, setMode] = useState('face');

	// function handleClick() {
	// 	if (mode == 'face') setMode('normal');
	// 	else setMode('face');
	// }

	return (
		<>
			{/* <Button onClick={() => handleClick()} /> */}
			<Box flex={0.7} p={6}>
				<Camera videoId='mainMenuCamera' mode={mode} />
			</Box>
			<Flex flexDirection={'column'} flex={0.3} pr={6} paddingY={5}>
				{/* TODO: IF logic toggle face login -> user menu */}
				<FaceLogin />
				<PublicMenu />
			</Flex>
		</>
	);
}
