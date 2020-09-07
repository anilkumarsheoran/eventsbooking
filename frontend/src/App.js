import React, { useState } from 'react';
import { BrowserRouter , Route, Redirect, Switch} from "react-router-dom";
import './App.css';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings'
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const login = (token, userId, tokenExpiration) =>{
    setToken(token);
    setUserId(userId)
  };
  const logout = () => {
    setToken(null);
    setUserId(null)
  }
  return (
   <BrowserRouter>
    <React.Fragment>
      <AuthContext.Provider value={{
        token: token, 
        userId: userId,
        login: login,
        logout: logout
      }}>
        <MainNavigation />
        <Switch>
          {token && <Redirect from="/" to="/events" exact/>}
          {token && <Redirect from="/auth" to="/events" exact/>}
          {!token && <Route path="/auth" component={AuthPage} />}
          <Route path="/events" component={EventsPage} />
          {token && <Route path="/bookings" component={BookingsPage} />}
          {!token && <Redirect to="/auth" exact/>}
        </Switch>
      </AuthContext.Provider>
    </React.Fragment>
   </BrowserRouter>
  );
}

export default App;
