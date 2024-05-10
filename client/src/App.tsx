import {Register} from '@/pages/Register';
import MainPageLayout from '@/pages/layout/MainPageLayout';
import SubPageLayout from '@/pages/layout/SubPageLayout';
import {AppContext, appContextInitialState, appContextReducer} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {themes} from '@/utils/themes';
import {ChakraProvider} from '@chakra-ui/react';
import {useReducer} from 'react';
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from 'react-router-dom';
import './App.css';
import {MainMenu} from './pages/MainMenu';

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route element={<MainPageLayout />}>
				<Route index element={<MainMenu />} />
				{/* <Route path={paths.menu} /> */}
				<Route path={paths.main.rent} /*element={}*/ />
				<Route path={paths.main.return} /*element={}*/ />
			</Route>
			<Route element={<SubPageLayout />}>
				<Route path={paths.sub.userHistory} /*element={}*/ />
				<Route path={paths.sub.userHistorySpecificRecord} /*element={}*/ />
				<Route path={paths.sub.publicHistory} /*element={}*/ />
				<Route path={paths.sub.equipmentAvailability} /*element={}*/ />
				<Route path={paths.sub.register} element={<Register />} />
				<Route path={paths.sub.registerAdmin} /*element={}*/ />
				<Route path={paths.sub.users} /*element={}*/ />
				<Route path={paths.sub.admins} /*element={}*/ />
				<Route path={paths.sub.equipment} /*element={}*/ />
				<Route path={paths.sub.verifications} /*element={}*/ />
			</Route>
		</>
	)
);

function App() {
	const [appState, appDispatch] = useReducer(appContextReducer, appContextInitialState);

	return (
		<AppContext.Provider value={{appState, appDispatch}}>
			<ChakraProvider theme={themes}>
				<RouterProvider router={router} />
			</ChakraProvider>
		</AppContext.Provider>
	);
}

export default App;
