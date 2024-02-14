import './App.css';
import Main from './components/Main';
import { ConfigProvider, Alert } from 'antd';
import withAuth from './Auth';
import {createContext, useState, useEffect} from 'react';
import {auth, fb_signOut} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import Signup from './pages/Signup';

const AuthContext = createContext();
const MainModeContext = createContext();
const ErrorContext = createContext(); //TODO

function App() {

  const [FB_USER, setFB_USER] = useState({});
  const [CREDITS, setCREDITS] = useState();
  const [MAIN_MODE, setMAIN_MODE] = useState('config');
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
        const options = { headers: {
          'Authorization': `Bearer ${idtoken}`
        }}
        const userData = await axios.post(`/login`, {}, options).catch(err => console.log(err));
        if(!userData?.data?.email) {
          fb_signOut();
          return console.log('No user found in DB', userData);
        }
        setFB_USER({...user, ...userData.data});
        setCREDITS(userData.data.credits);
      }
  })}, []);


  function renderApp(){
    // here are pages outside of login
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
          <MainModeContext.Provider value={{MAIN_MODE, setMAIN_MODE}}>
            {renderApp()}
          </MainModeContext.Provider>
        </AuthContext.Provider>
      </ConfigProvider> 
    </div>
  );
}

export {App, AuthContext, MainModeContext, ErrorContext};
