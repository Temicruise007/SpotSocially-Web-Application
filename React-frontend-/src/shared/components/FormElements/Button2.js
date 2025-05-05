import React from 'react';
import { Link } from 'react-router-dom';
import './Button2.css';

const Button2 = props => {
  // Combine any extra classes if needed.
  const btnClasses = `Btn ${props.extraClasses ? props.extraClasses : ''}`;

  // If an href is provided, render an anchor element.
  if (props.href) {
    return (
      <a className={btnClasses} href={props.href}>
        <div className="sign">
          {props.icon ? (
            props.icon
          ) : (
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9z"></path>
            </svg>
          )}
        </div>
        <div className="text">
          {props.text || 'select file'}
        </div>
      </a>
    );
  }

  // If a "to" prop is provided, use React Router's Link.
  if (props.to) {
    return (
      <Link className={btnClasses} to={props.to} exact={props.exact}>
        <div className="sign">
          {props.icon ? (
            props.icon
          ) : (
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9z"></path>
            </svg>
          )}
        </div>
        <div className="text">
          {props.text || 'select file'}
        </div>
      </Link>
    );
  }

  // Otherwise, render a standard button element.
  return (
    <button
      type={props.type || 'button'}
      className={btnClasses}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className="sign">
        {props.icon ? (
          props.icon
        ) : (
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9z"></path>
          </svg>
        )}
      </div>
      <div className="text">
        {props.children || props.text || 'select photo'}
      </div>
    </button>
  );
};

export default Button2;
