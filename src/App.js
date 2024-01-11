import './App.css';
import Main from './components/Main';
import { ConfigProvider } from 'antd';
import withAuth from './Auth';
import {createContext, useState, useEffect} from 'react';
import {auth} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();
const MainModeContext = createContext();

function App() {

  const [FB_USER, setFB_USER] = useState({});
  const [MAIN_MODE, setMAIN_MODE] = useState('config');

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
    if (!user?.uid) return setFB_USER({});
    const userData = await axios.get(`http://localhost:8000/users/${user.uid}`).catch(err=>console.log(err));
    if(!userData?.data?.recordset[0]) return console.log('No user found in DB', userData.data);
    setFB_USER({...user, ...userData.data.recordset[0]});

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
        <AuthContext.Provider value = {{FB_USER, setFB_USER}}>
          <MainModeContext.Provider value={{MAIN_MODE, setMAIN_MODE}}>
            {withAuth(Main, FB_USER)}
          </MainModeContext.Provider>
        </AuthContext.Provider>
      </ConfigProvider>
    </div>
  );
}

export {App, AuthContext, MainModeContext};
