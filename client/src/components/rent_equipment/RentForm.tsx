import {useAppContext} from '@/utils/context/AppContext';
import {useInitialScanContext, useScanContext} from '@/utils/context/ScanContext';
import {useEffect} from 'react';

export const RentForm: React.FC = () => {
	const {appDispatch} = useAppContext();
	const {goToPrevious} = useScanContext() as ReturnType<typeof useInitialScanContext>;

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				goToPrevious();
			}
		});
	}, []);

	return <></>;
};
