import ImageManager from '@/components/ui/ImageManager';
import {useLocation} from 'react-router-dom';

type LocationState = {
	images: Blob[];
};

export function RentResult() {
	const location = useLocation();
	const {images} = location.state as LocationState;
	return (
		<>
			<ImageManager specifiedImages={images} />
		</>
	);
}
