import React,{useContext} from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context';

function MainNavigation(props){
   const context = useContext(AuthContext);
    return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Events Booking</h1>
          </div>
          <nav className="main-navigation__item">
            <ul>
                {!context.token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                <li><NavLink to="/events">Events</NavLink></li>
                {context.token && 
                <>
                  <li><NavLink to="/bookings">Booking</NavLink></li>
                  <li><button onClick={()=> context.logout()}>Logout</button></li>
                </>}
                
            </ul>
          </nav> 
        </header>
    )
} 

export default MainNavigation;