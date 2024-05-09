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
				<Route path={paths.rent} /*element={}*/ />
				<Route path={paths.return} /*element={}*/ />
				<Route path={paths.userHistory} /*element={}*/ />
			</Route>
			<Route element={<SubPageLayout />}>
				<Route path={paths.userHistorySpecificRecord} /*element={}*/ />
				<Route path={paths.publicHistory} /*element={}*/ />
				<Route path={paths.equipmentAvailability} /*element={}*/ />
				<Route path={paths.register} element={<Register />} />
				<Route path={paths.registerAdmin} /*element={}*/ />
				<Route path={paths.users} /*element={}*/ />
				<Route path={paths.admins} /*element={}*/ />
				<Route path={paths.equipment} /*element={}*/ />
				<Route path={paths.verifications} /*element={}*/ />
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
