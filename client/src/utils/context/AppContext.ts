import {User} from '@/utils/data';
import {useToast, UseToastOptions} from '@chakra-ui/toast';
import {createContext, Dispatch, useContext} from 'react';

type AppContextState = {
	pageLoading: boolean;
	loadingLabelType: string;
	user: User | null;
	toastOptions: UseToastOptions | null;
	detectedUser: User | null;
	detectedUserImageURL: string | null;
	handleSubHeaderBack: () => void;
	// Video camera states
	videoLoading: boolean;
	mediaStreams: MediaStream[] | null;
	handleOpenExistingPeerConnection: () => void;
	handleCloseExistingPeerConnection: () => void;
	handleCloseNormalCamera: () => void;
	handleRemoveFacePredict: () => void;
};
type AppContextActionType =
	| 'SHOW_TOAST'
	| 'SET_PAGE_LOADING'
	| 'SET_PAGE_LOADING_LABEL_TYPE'
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
	| 'SET_CLOSE_NORMAL_CAMERA'
	| 'SET_REMOVE_FACE_PREDICT';
type AppContextActionPayload =
	| UseToastOptions
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
	loadingLabelType: 'default',
	user: null,
	toastOptions: null,
	detectedUser: null,
	detectedUserImageURL: null,
	handleSubHeaderBack: () => {},
	// Video camera states
	mediaStreams: null,
	videoLoading: false,
	handleOpenExistingPeerConnection: () => {},
	handleCloseExistingPeerConnection: () => {},
	handleCloseNormalCamera: () => {},
	handleRemoveFacePredict: () => {}
};
export const appContextReducer = (
	state: AppContextState,
	action: AppContextAction
): AppContextState => {
	switch (action.type) {
		case 'SHOW_TOAST':
			return {...state, toastOptions: action.payload as UseToastOptions};
		case 'SET_PAGE_LOADING':
			return {...state, pageLoading: action.payload as boolean};
		case 'SET_PAGE_LOADING_LABEL_TYPE':
			return {...state, loadingLabelType: action.payload as string};
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
		case 'SET_REMOVE_FACE_PREDICT':
			return {
				...state,
				handleRemoveFacePredict: action.payload as () => void
			};

		default:
			return state;
	}
};

export const useInitialAppUtils = () => {
	const toast = useToast();

	return {
		toast
	};
};

export const AppContext = createContext<
	(AppContextValue & {appUtils: ReturnType<typeof useInitialAppUtils>}) | null
>(null);

export const useAppContext = () =>
	useContext(AppContext) as AppContextValue & {appUtils: ReturnType<typeof useInitialAppUtils>};
