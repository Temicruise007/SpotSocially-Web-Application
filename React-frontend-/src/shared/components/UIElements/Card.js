import React from 'react';

import './Card.css';

const Card = props => {
  return (
    //allows us to add custom classes and styles to the card component from outside of the card component itself
    //props.className allows us to add custom classes to the card component
    //props.style allows us to add custom styles to the card componen
    //props.children allows us to wrap other components inside of the card component
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
