import '@/App.css';
import {Outlet} from 'react-router-dom';

function SubPageLayout() {
	return (
		<div className='site-container'>
			<MainHeader />
			<div className='page-container'>
				<Outlet />
			</div>
		</div>
	);
}

export default SubPageLayout;
