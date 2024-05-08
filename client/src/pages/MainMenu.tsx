import {FaceLogin} from '@/components/main_menu/FaceLogin';
import {PublicMenu} from '@/components/main_menu/PublicMenu';
import {Camera} from '@/components/ui/Camera/Camera';
import {Flex} from '@chakra-ui/react';
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
			<Camera mode={mode} />
			<Flex flexDirection={'column'} flex={0.3} pr={'1.5rem'}>
				{/* TODO: IF logic toggle face login -> user menu */}
				<FaceLogin />
				<PublicMenu />
			</Flex>
		</>
	);
}
