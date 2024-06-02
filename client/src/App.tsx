import {Error404} from '@/pages/Error404';
import {Register} from '@/pages/Register';
import {Rent} from '@/pages/Rent';
import {RentResult} from '@/pages/RentResult';
import {Return} from '@/pages/Return';
import {ReturnResult} from '@/pages/ReturnResult';
import {ViewUsers} from '@/pages/ViewUsers';
import MainPageLayout from '@/pages/layout/MainPageLayout';
import SubPageLayout from '@/pages/layout/SubPageLayout';
import {
	AppContext,
	appContextInitialState,
	appContextReducer,
	useAppContext
} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {themes} from '@/utils/themes';
import {Box, Center, ChakraProvider, Spinner} from '@chakra-ui/react';
import {useReducer} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {
	Navigate,
	Outlet,
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements
} from 'react-router-dom';
import './App.css';
import favicon from './assets/favicon.ico';
import {MainMenu} from './pages/MainMenu';

function AuthCheck() {
	const {appState} = useAppContext();
	const {user} = appState;
	// const hasUser = !!Object.entries(user || {}).length; //FIXME: Correct format, change to this after development
	const hasUser = !Object.entries(user || {}).length;

	if (!hasUser) {
		return <Navigate to={paths.main.root} />;
	}

	return <Outlet />;
}

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route errorElement={<Error404 />}>
			<Route element={<MainPageLayout />}>
				<Route index element={<MainMenu />} />
				<Route element={<AuthCheck />}>
					<Route path={paths.main.rent} element={<Rent />} />
					<Route path={paths.main.return} element={<Return />} />
				</Route>
			</Route>

			<Route element={<SubPageLayout />}>
				<Route path={paths.sub.publicHistory} /*element={}*/ />
				<Route path={paths.sub.equipmentAvailability} /*element={}*/ />
				<Route path={paths.sub.register} element={<Register />} />
				<Route element={<AuthCheck />}>
					<Route path={paths.sub.rentResult} element={<RentResult />} />
					<Route path={paths.sub.returnResult} element={<ReturnResult />} />
					<Route path={paths.sub.userHistory} /*element={}*/ />
					<Route path={paths.sub.registerAdmin} /*element={}*/ />
					<Route path={paths.sub.users} element={<ViewUsers />} />
					<Route path={paths.sub.admins} /*element={}*/ />
					<Route path={paths.sub.equipment} /*element={}*/ />
					<Route path={paths.sub.verifications} /*element={}*/ />
				</Route>
			</Route>
		</Route>
	)
);

function App() {
	const [appState, appDispatch] = useReducer(appContextReducer, appContextInitialState);
	const {pageLoading} = appState;

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<link rel='icon' href={favicon} />
				</Helmet>
				<AppContext.Provider value={{appState, appDispatch}}>
					<ChakraProvider theme={themes}>
						<Box
							position={'relative'}
							h={'100%'}
							w={'100%'}
							{...(pageLoading && {pointerEvents: 'none'})} // Disable pointer events when page is loading
						>
							{/* Loading overlay */}
							{pageLoading && (
								<Box position={'absolute'} h={'100%'} w={'100%'} zIndex={99}>
									<Box
										position={'absolute'}
										backgroundColor={'gray.800'}
										opacity={0.5}
										w={'100%'}
										h={'100%'}
										zIndex={99}
									/>
									<Center position={'absolute'} h={'100%'} w={'100%'}>
										<Spinner size='xl' thickness='3px' color='white' zIndex={100} />
									</Center>
								</Box>
							)}
							<RouterProvider router={router} />
						</Box>
					</ChakraProvider>
				</AppContext.Provider>
			</HelmetProvider>
		</>
	);
}

export default App;
