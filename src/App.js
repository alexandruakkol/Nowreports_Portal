import './App.css';
import './GoogleButton.css'
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
import {FB_err_handler} from './utils';
import { newAccountSequence, FBError } from './account_operations';

const AuthContext = createContext();
const ErrorContext = createContext(); //TODO

function App() {

  const [FB_USER, setFB_USER] = useState({});
  const [CREDITS, setCREDITS] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user?.uid) return setFB_USER({});
      const createdDate = user.metadata.createdAt;
      const now = (new Date()) * 1;
      
      // can be google or password
      user.loginProvider = user.providerData?.[0]?.providerId;

      //don't auto-login brand new accounts right away
      if((now - createdDate) < (1 * 60_000)) return setTimeout(login, 3000);
      else login();
      
      async function login(){
        const idtoken = await user.getIdToken();
        const options = { headers: {'Authorization': `Bearer ${idtoken}`}}; 
        let userData;
        try{

          userData = await axios.post(`${window.appdata.API_ADDR}/login`, {withCredentials:true}, options)

        } catch(err) {
          if( (user?.loginProvider === 'google.com') && (err?.response?.status === 401) ){
            //if google cannot login, it's the first login. create sql account.
            const {displayName, email} = user;
  
            const data = {email, name:displayName, user};
            if(!email) return;
            try{
              const newAccountRes = await newAccountSequence(
                data, 
                (err)=>{alert('Account creation error, Code 28')},  //page err handler
                (err)=>{alert('Account creation error, Code 29')}  //firebase err handler
              );
              if(newAccountRes?.ok) return await login(); //try login again after account made
            } catch(err){
              if(err instanceof FBError) return alert(FB_err_handler(err.code));
            }
          }
          else { //generic error
            fb_signOut();
            alert('There was a problem with your login attempt. \nPlease try again later or contact support@nowreports.com');
            return sendLog('Code 1 loginerror ' + String(err))
          };
        }
        
        if(!(userData?.data?.email) && (user?.loginProvider === 'password')) {
          fb_signOut();
          return alert('Login error. Code 30');
        }//console.log('signout code x'); //TODO: centralize err

        setFB_USER({...user, ...userData?.data});
        setCREDITS(userData?.data.credits);
      }
  })}, []);


  function renderApp(){
    // here are pages outside of login
    if(!(FB_USER?.providerData?.[0]?.providerId==='google.com')){
      if(window.location.pathname == '/') return <Landing></Landing>; 
      if(window.location.pathname == '/signup') return <Signup></Signup>; 
    }
    //if(window.location.pathname != '/') window.location.pathname = '/'
    return withAuth(Main, FB_USER);
  }

  return (
    <div className="App">
     
      {/* these are antd mods */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              activeBarHeight:0,
              activeBarBorderWidth:0,
            }
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
