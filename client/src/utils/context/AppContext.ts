import {User} from '@/utils/data';
import {Dispatch, createContext, useContext} from 'react';

type AppContextState = {
	pageLoading: boolean;
	loadingLabel: string;
	user: User | null;
	detectedUser: User | null;
	detectedUserImageURL: string | null;
	handleSubHeaderBack: () => void;
	// Video camera states
	videoLoading: boolean;
	mediaStreams: MediaStream[] | null;
	handleOpenExistingPeerConnection: () => void;
	handleCloseExistingPeerConnection: () => void;
	handleCloseNormalCamera: () => void;
};
type AppContextActionType =
	| 'SET_PAGE_LOADING'
	| 'SET_PAGE_LOADING_LABEL'
	| 'SET_USER'
	| 'SET_DETECTED_USER'
	| 'SET_DETECTED_USER_IMAGE_URL'
	| 'SET_HANDLE_SUBHEADER_BACK'
	// Video camera states
	| 'SET_VIDEO_LOADING'
	| 'SET_MEDIA_STREAMS'
	| 'ADD_MEDIA_STREAM'
	| 'SET_OPEN_EXISTING_PEER_CONNECTION'
	| 'SET_CLOSE_EXISTING_PEER_CONNECTION'
	| 'SET_CLOSE_NORMAL_CAMERA';
type AppContextActionPayload =
	| User
	| string
	| boolean
	| MediaStream
	| MediaStream[]
	| (() => void)
	| null;
type AppContextAction = {
	type: AppContextActionType;
	payload?: AppContextActionPayload;
};
type AppContextValue = {appState: AppContextState; appDispatch: Dispatch<AppContextAction>};

export const appContextInitialState: AppContextState = {
	pageLoading: false,
	loadingLabel: 'Loading',
	user: null,
	detectedUser: null,
	detectedUserImageURL: null,
	handleSubHeaderBack: () => {},
	// Video camera states
	mediaStreams: null,
	videoLoading: false,
	handleOpenExistingPeerConnection: () => {},
	handleCloseExistingPeerConnection: () => {},
	handleCloseNormalCamera: () => {}
};
export const appContextReducer = (
	state: AppContextState,
	action: AppContextAction
): AppContextState => {
	switch (action.type) {
		case 'SET_PAGE_LOADING':
			return {...state, pageLoading: action.payload as boolean};
		case 'SET_PAGE_LOADING_LABEL':
			return {...state, loadingLabel: action.payload as string};
		case 'SET_USER':
			return {...state, user: action.payload as User | null};
		case 'SET_DETECTED_USER':
			return {...state, detectedUser: action.payload as User | null};
		case 'SET_DETECTED_USER_IMAGE_URL':
			return {...state, detectedUserImageURL: action.payload as string | null};
		case 'SET_HANDLE_SUBHEADER_BACK':
			return {...state, handleSubHeaderBack: action.payload as () => void};
		// MEDIA STREAMS & VIDEO CAMERA CONTEXT SWITCHING
		case 'SET_VIDEO_LOADING':
			return {...state, videoLoading: action.payload as boolean};
		case 'SET_MEDIA_STREAMS':
			return {...state, mediaStreams: action.payload as MediaStream[] | null};
		case 'ADD_MEDIA_STREAM':
			return {
				...state,
				mediaStreams: [...(state.mediaStreams || []), action.payload as MediaStream]
			};
		case 'SET_OPEN_EXISTING_PEER_CONNECTION':
			return {...state, handleOpenExistingPeerConnection: action.payload as () => void};
		case 'SET_CLOSE_EXISTING_PEER_CONNECTION':
			return {...state, handleCloseExistingPeerConnection: action.payload as () => void};
		case 'SET_CLOSE_NORMAL_CAMERA':
			return {
				...state,
				handleCloseNormalCamera: action.payload as () => void
			};

		default:
			return state;
	}
};
export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = () => useContext(AppContext) as AppContextValue;
