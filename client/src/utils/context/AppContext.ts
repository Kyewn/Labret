import {Dispatch, createContext} from 'react';

type AppContextState = {
	user: string | null;
};
type AppContextActionType = 'SET_USER';
type AppContextActionPayload = string | null;
type AppContextAction = {
	type: AppContextActionType;
	payload: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	user: null
};
export const appContextReducer = (state: AppContextState, action: AppContextAction) => {
	switch (action.type) {
		case 'SET_USER':
			return {...state, user: action.payload};
	}
};
export const AppContext = createContext<AppContextValue>({
	appState: appContextInitialState,
	appDispatch: () => {}
});
