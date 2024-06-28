import { initializeApp } from "firebase/app";
import {getAuth, signOut, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {getAnalytics} from "firebase/analytics";

let authProviders = {};
authProviders.google = new GoogleAuthProvider();

const {REACT_APP_FB_KEY,REACT_APP_AUTH_DOMAIN,REACT_APP_PJ_ID,
  REACT_APP_STORAGE_BUCKET,REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APPID,REACT_APP_MEASUREMENT_ID} = process.env;

const firebaseConfig = {
  apiKey: REACT_APP_FB_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PJ_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APPID,
  measurementId: REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

function fb_signOut(){
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

function googleSignup(onOk, onFail){
  signInWithPopup(auth, authProviders.google)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    onOk({result, credential});

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    onFail(error);
  });
}

export {auth, fb_signOut, googleSignup};