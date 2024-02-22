import './App.css';
import Main from './components/Main';
import { ConfigProvider } from 'antd';
import withAuth from './Auth';
import {createContext, useState, useEffect} from 'react';
import {auth, fb_signOut} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { WithNavbar } from './etc';
import { sendLog } from './utils';

const AuthContext = createContext();
const ErrorContext = createContext(); //TODO

function App() {

  const [FB_USER, setFB_USER] = useState({});
  const [CREDITS, setCREDITS] = useState();
  const unLoggedSection = window.location.pathname;

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user?.uid) return setFB_USER({});
      const createdDate = user.metadata.createdAt;
      const now = (new Date()) * 1;

      //don't auto-login brand new accounts right away
      if((now - createdDate) < (1 * 60_000)) return setTimeout(login, 3000);
      else login();

      async function login(){
        const idtoken = await user.getIdToken();
        const options = { headers: {'Authorization': `Bearer ${idtoken}`}};   
        const userData = await axios.post(`/login`, {}, options).catch(err => {
            alert('There was a problem with your login attempt. \nPlease try again later or contact support@nowreports.com');
            sendLog('Code 1 loginerror ' + String(err))
          }
        );
        if(!userData?.data?.email) return fb_signOut();
        setFB_USER({...user, ...userData.data});
        setCREDITS(userData.data.credits);
      }
  })}, []);


  function renderApp(){
    // here are pages outside of login
    if(unLoggedSection == '/') return <Landing></Landing>; 
    if(unLoggedSection == '/signup') return <Signup></Signup>; 
    else return withAuth(Main, FB_USER);
  }

  return (
    <div className="App">
     
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              activeBarHeight:0,activeBarBorderWidth:0
            },
          },
        }}
      >
        <AuthContext.Provider value = {{FB_USER, setFB_USER, setCREDITS, CREDITS}}>
            {renderApp()}
        </AuthContext.Provider>
      </ConfigProvider> 
    </div>
  );
}

export {App, AuthContext, ErrorContext};
