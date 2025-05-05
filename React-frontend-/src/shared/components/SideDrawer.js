import React from 'react';
import {createPortal} from 'react-dom'; //Directly import createPortal from react-dom instead of importing ReactDOM and using ReactDOM.createPortal
//This is a more efficient way of importing createPortal from react-dom instead of importing ReactDOM and using ReactDOM.createPortal
// createPortal is a function that allows us to render a component in a different place in the DOM than where it is defined
// createPortal takes two arguments: the JSX element we want to render and the DOM element where we want to render it
// The first argument is the JSX element we want to render
// The second argument is the DOM element where we want to render the JSX element

import { CSSTransition } from 'react-transition-group'; //Import CSSTransition from react-transition-group
// CSSTransition is a component that allows us to add CSS transitions to our components when they enter or leave the DOM


import './SideDrawer.css';

const SideDrawer = props => {
    
    const content = (
        <CSSTransition 
            in={props.show} 
            timeout={200} 
            classNames={'slide-in-left'} 
            mountOnEnter
            unmountOnExit
        >
            <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
        </CSSTransition>
    );

    return createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;