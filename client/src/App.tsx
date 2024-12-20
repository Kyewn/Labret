import {EditRecord} from '@/components/user_history/EditRecord';
import {AddItem} from '@/pages/AddItem';
import {Error404} from '@/pages/Error404';
import {ItemAvailability} from '@/pages/ItemAvailability';
import {ManageVerifications} from '@/pages/ManageVerifications';
import {PublicHistory} from '@/pages/PublicHistory';
import {Register} from '@/pages/Register';
import {RegisterAdmin} from '@/pages/RegisterAdmin';
import {Rent} from '@/pages/Rent';
import {RentScanResult} from '@/pages/RentScanResult';
import {Return} from '@/pages/Return';
import {ReturnScanResult} from '@/pages/ReturnScanResult';
import {SettleDebts} from '@/pages/SettleDebts';
import {UserHistory} from '@/pages/UserHistory';
import {ViewAdmins} from '@/pages/ViewAdmins';
import {ViewItems} from '@/pages/ViewItems';
import {ViewUsers} from '@/pages/ViewUsers';
import MainPageLayout from '@/pages/layout/MainPageLayout';
import SubPageLayout from '@/pages/layout/SubPageLayout';
import {getLoadingLabelComponent} from '@/utils/component_functions';
import {
	AppContext,
	appContextInitialState,
	appContextReducer,
	useAppContext,
	useInitialAppUtils
} from '@/utils/context/AppContext';
import {paths} from '@/utils/paths';
import {themes} from '@/utils/themes';
import {Box, ChakraProvider, Spinner, VStack} from '@chakra-ui/react';
import {useReducer} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Outlet,
	Route,
	RouterProvider
} from 'react-router-dom';
import './App.css';
import favicon from './assets/favicon.ico';
import {MainMenu} from './pages/MainMenu';

function AuthCheck() {
	const {appState} = useAppContext();
	const {user} = appState;
	const hasUser = !!Object.entries(user || {}).length; //TODO: Correct format, change to this after development
	// const hasUser = !Object.entries(user || {}).length;

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
				<Route path={paths.sub.publicHistory} element={<PublicHistory />} />
				<Route path={paths.sub.itemAvailability} element={<ItemAvailability />} />
				<Route path={paths.sub.register} element={<Register />} />
				<Route element={<AuthCheck />}>
					<Route path={paths.sub.rentResult} element={<RentScanResult />} />
					<Route path={paths.sub.returnResult} element={<ReturnScanResult />} />
					<Route path={paths.sub.users} element={<ViewUsers />} />
					<Route path={paths.sub.admins} element={<ViewAdmins />} />
					<Route path={paths.sub.registerAdmin} element={<RegisterAdmin />} />
					<Route path={paths.sub.userHistory} element={<UserHistory />} />
					<Route path={paths.sub.editRecord} element={<EditRecord />} />
					<Route path={paths.sub.items} element={<ViewItems />} />
					<Route path={paths.sub.addItem} element={<AddItem />} />
					<Route path={paths.sub.verifications} element={<ManageVerifications />} />
					<Route path={paths.sub.debts} element={<SettleDebts />} />
				</Route>
			</Route>
		</Route>
	)
);

function App() {
	const [appState, appDispatch] = useReducer(appContextReducer, appContextInitialState);
	const appUtils = useInitialAppUtils();
	const {pageLoading, loadingLabelType} = appState;

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<link rel='icon' href={favicon} />
				</Helmet>
				<AppContext.Provider value={{appState, appDispatch, appUtils}}>
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
									<VStack position={'absolute'} justifyContent={'center'} h={'100%'} w={'100%'}>
										<Spinner size='xl' thickness='3px' color='white' zIndex={100} />
										{getLoadingLabelComponent(loadingLabelType)}
									</VStack>
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
