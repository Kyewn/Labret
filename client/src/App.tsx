import {FullPageLayout} from '@/layout/FullPageLayout';
import LeftContentLayout from '@/layout/LeftContentLayout';
import {RightContentLayout} from '@/layout/RightContentLayout';
import {paths} from '@/utils/paths';
import {themes} from '@/utils/themes';
import {ChakraBaseProvider} from '@chakra-ui/react';
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from 'react-router-dom';
import './App.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<LeftContentLayout />}>
				<Route index /*element={}*/ />
				<Route path={paths.menu} /*element={}*/ />
			</Route>
			<Route element={<RightContentLayout />}>
				<Route path={paths.rent} /*element={}*/ />
				<Route path={paths.return} /*element={}*/ />
			</Route>
			<Route element={<FullPageLayout />}>
				<Route path={paths.userHistory} /*element={}*/ />
				<Route path={paths.publicHistory} /*element={}*/ />
				<Route path={paths.itemAvailability} /*element={}*/ />
				<Route path={paths.renterSignup} /*element={}*/ />
				<Route path={paths.adminSignup} /*element={}*/ />
				<Route path={paths.profile} /*element={}*/ />
				<Route path={paths.admins} /*element={}*/ />
				<Route path={paths.equipment} /*element={}*/ />
				<Route path={paths.verifications} /*element={}*/ />
			</Route>
		</>
	)
);

function App() {
	return (
		<ChakraBaseProvider theme={themes}>
			<RouterProvider router={router} />
		</ChakraBaseProvider>
	);
}

export default App;
