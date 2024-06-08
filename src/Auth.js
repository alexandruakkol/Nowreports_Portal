import Login from './pages/Login';

const withAuth = (WrappedComponent, fb_user) => {

    const isAuthenticated = !!fb_user.uid;
  
    return (
       isAuthenticated ? <WrappedComponent></WrappedComponent>
       : <Login></Login>
    )
 
};

export default withAuth;