import {Dispatch, createContext, useContext} from 'react';

type AppContextState = {
	user: string | null;
	detectedUser: string | null;
	videoLoading: boolean;
};
type AppContextActionType = 'SET_USER' | 'SET_DETECTED_USER' | 'SET_VIDEO_LOADING';
type AppContextActionPayload = string | boolean | null;
type AppContextAction = {
	type: AppContextActionType;
	payload: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	user: null,
	detectedUser: null,
	videoLoading: false
};
export const appContextReducer = (
	state: AppContextState,
	action: AppContextAction
): AppContextState => {
	switch (action.type) {
		case 'SET_USER':
			return {...state, user: action.payload as string};
		case 'SET_DETECTED_USER':
			return {...state, detectedUser: action.payload as string};
		case 'SET_VIDEO_LOADING':
			return {...state, videoLoading: action.payload as boolean};
		default:
			return state;
	}
};
export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = () => useContext(AppContext) as AppContextValue;
