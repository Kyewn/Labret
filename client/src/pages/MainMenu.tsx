import {FaceCamera} from '@/components/main_menu/FaceCamera';
import {FaceLoginMenu} from '@/components/main_menu/FaceLoginMenu';
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
			<FaceCamera mode={mode} />
			<FaceLoginMenu />
		</>
	);
}
