import './App.css';
import Main from './components/Main';
import { ConfigProvider, Alert } from 'antd';
import withAuth from './Auth';
import {createContext, useState, useEffect} from 'react';
import {auth, fb_signOut} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();
const MainModeContext = createContext();
const ErrorContext = createContext(); //TODO

function App() {

  const [FB_USER, setFB_USER] = useState({});
  const [CREDITS, setCREDITS] = useState();
  const [MAIN_MODE, setMAIN_MODE] = useState('config');

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
    if (!user?.uid) return setFB_USER({});
    const idtoken = await user.getIdToken()
    const options = { headers: {
      'Authorization': `Bearer ${idtoken}`
    }}
    const userData = await axios.post(`/login`, {}, options).catch(err => console.log(err));
    if(!userData?.data?.email) {
      fb_signOut();
      return console.log('No user found in DB', userData);
    }
    console.log('FB_USER:', {...user, ...userData.data})
    setFB_USER({...user, ...userData.data});
    setCREDITS(userData.data.credits);
  })}, []);

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
            {withAuth(Main, FB_USER)}
          </MainModeContext.Provider>
        </AuthContext.Provider>
      </ConfigProvider> 
    </div>
  );
}

export {App, AuthContext, MainModeContext, ErrorContext};
