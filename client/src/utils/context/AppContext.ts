import {Dispatch, createContext, useContext} from 'react';

type AppContextState = {
	user: string | null;
	videoLoading: boolean;
};
type AppContextActionType = 'SET_USER' | 'SET_VIDEO_LOADING';
type AppContextActionPayload = string | boolean | null;
type AppContextAction = {
	type: AppContextActionType;
	payload: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	user: null,
	videoLoading: false
};
export const appContextReducer = (state: AppContextState, action: AppContextAction) => {
	switch (action.type) {
		case 'SET_USER':
			return {...state, user: action.payload};
		case 'SET_VIDEO_LOADING':
			return {...state, videoLoading: action.payload};
	}
};
export const AppContext = createContext<AppContextValue>({
	appState: appContextInitialState,
	appDispatch: () => {}
});

export const useAppContext = () => useContext(AppContext);
