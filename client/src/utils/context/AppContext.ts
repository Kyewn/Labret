import {Dispatch, createContext, useContext} from 'react';

type VideoMode = 'face' | 'equipment';

type AppContextState = {
	pageLoading: boolean;
	user: string | null;
	detectedUser: string | null;
	handleSubHeaderBack: () => void;
	// Video camera states
	videoLoading: boolean;
	mediaStreams: MediaStream[] | null;
	videoMode: VideoMode;
	handleCloseExistingPeerConnection: () => void;
	handleCloseNormalCamera: () => void;
};
type AppContextActionType =
	| 'SET_PAGE_LOADING'
	| 'SET_USER'
	| 'SET_DETECTED_USER'
	| 'SET_HANDLE_SUBHEADER_BACK'
	// Video camera states
	| 'SET_VIDEO_LOADING'
	| 'SET_MEDIA_STREAMS'
	| 'ADD_MEDIA_STREAM'
	| 'SET_VIDEO_MODE'
	| 'SET_CLOSE_EXISTING_PEER_CONNECTION'
	| 'SET_CLOSE_NORMAL_CAMERA';
type AppContextActionPayload =
	| VideoMode
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
	user: null,
	detectedUser: null,
	handleSubHeaderBack: () => {},
	// Video camera states
	mediaStreams: null,
	videoLoading: false,
	videoMode: 'face',
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
		case 'SET_USER':
			return {...state, user: action.payload as string | null};
		case 'SET_DETECTED_USER':
			return {...state, detectedUser: action.payload as string | null};
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
		case 'SET_VIDEO_MODE':
			return {...state, videoMode: action.payload as VideoMode};
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
