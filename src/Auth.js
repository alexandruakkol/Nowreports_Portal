import React, {useContext} from 'react'
import Login from './pages/Login';
import {AuthContext} from './App';
import Navbar from './components/Navbar';

const withAuth = (WrappedComponent, fb_user) => {

    const isAuthenticated = !!fb_user.uid;
  
    return (
       isAuthenticated ? <WrappedComponent></WrappedComponent>
       : <Login></Login>
    )
 
};

export default withAuth;