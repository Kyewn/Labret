import '@/App.css';
import {Outlet} from 'react-router-dom';

function LeftContentLayout() {
	return (
		<div className='site-container'>
			{/* <Sidebar /> */}
			<div className='page-container'>
				<Outlet />
			</div>
		</div>
	);
}

export default LeftContentLayout;
