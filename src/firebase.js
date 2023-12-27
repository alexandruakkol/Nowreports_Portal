import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
//const analytics = getAnalytics(app);

export default app;