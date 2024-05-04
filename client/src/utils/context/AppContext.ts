import {Dispatch, createContext} from 'react';

type AppContextState = {
	showToast: boolean;
};
type AppContextActionType = 'SHOW_TOAST';
type AppContextActionPayload = boolean;
type AppContextAction = {
	type: AppContextActionType;
	payload: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	showToast: false
};
export const appContextReducer = (state: AppContextState, action: AppContextAction) => {
	switch (action.type) {
		case 'SHOW_TOAST':
			return {...state, showToast: action.payload};
	}
};
export const AppContext = createContext<AppContextValue>({
	appState: appContextInitialState,
	appDispatch: () => {}
});
