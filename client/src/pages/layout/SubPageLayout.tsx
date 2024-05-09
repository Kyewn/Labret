import '@/App.css';
import SubHeader from '@/components/ui/SubHeader';
import {Outlet} from 'react-router-dom';

function SubPageLayout() {
	return (
		<div className='site-container'>
			<SubHeader />
			<div className='page-container'>
				<Outlet />
			</div>
		</div>
	);
}

export default SubPageLayout;
