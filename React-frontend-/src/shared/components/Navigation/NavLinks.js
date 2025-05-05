import React, { useContext }from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';
import Button2 from '../FormElements/Button2';

const NavLinks = props => {
    const auth = useContext(AuthContext);
    //component will re-render whenever the context we're listening to changes i.e. 
    //the value of auth.isLoggedIn changes

    return (
        <ul className="nav-links">
        <li>
            <NavLink to="/" exact>ALL USERS</NavLink>
        </li>

        {auth.isLoggedIn && ( //my places will only be visible if the user is logged in
        <li>
            <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
        )}

        {auth.isLoggedIn && ( //add place will only be visible if the user is logged in
        <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
        )}

        {!auth.isLoggedIn && ( //authenticate will only be visible if the user is not logged in
        <li>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
        )}
        {auth.isLoggedIn && (
        <li>
            <Button2 onClick={auth.logout}>LOGOUT</Button2>
        </li>
        )}
        </ul>
    );
};

export default NavLinks;
