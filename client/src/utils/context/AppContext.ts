import {Dispatch, createContext, useContext} from 'react';

type AppContextState = {
	user: string | null;
	detectedUser: string | null;
	videoLoading: boolean;
	handleSubHeaderBack: () => void;
};
type AppContextActionType =
	| 'SET_USER'
	| 'SET_DETECTED_USER'
	| 'SET_VIDEO_LOADING'
	| 'SET_HANDLE_SUBHEADER_BACK';
type AppContextActionPayload = string | boolean | (() => void) | null;
type AppContextAction = {
	type: AppContextActionType;
	payload: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	user: null,
	detectedUser: null,
	videoLoading: false,
	handleSubHeaderBack: () => {}
};
export const appContextReducer = (
	state: AppContextState,
	action: AppContextAction
): AppContextState => {
	switch (action.type) {
		case 'SET_USER':
			return {...state, user: action.payload as string | null};
		case 'SET_DETECTED_USER':
			return {...state, detectedUser: action.payload as string | null};
		case 'SET_VIDEO_LOADING':
			return {...state, videoLoading: action.payload as boolean};
		case 'SET_HANDLE_SUBHEADER_BACK':
			return {...state, handleSubHeaderBack: action.payload as () => void};
		default:
			return state;
	}
};
export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = () => useContext(AppContext) as AppContextValue;
