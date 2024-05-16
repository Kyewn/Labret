// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBp7cxljHQ82_X_NUj9VGF925u7zgovDN0',
	authDomain: 'labret-d366e.firebaseapp.com',
	projectId: 'labret-d366e',
	storageBucket: 'labret-d366e.appspot.com',
	messagingSenderId: '732741753664',
	appId: '1:732741753664:web:257695fd2c3230601638a5',
	measurementId: 'G-HT7J3LQCWH'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
