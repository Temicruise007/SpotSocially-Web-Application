import React, { useReducer, useEffect } from 'react';
//useReducer is used when you have a complex state logic that involves multiple sub-values or when the next state depends on the previous one.

import { validate} from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',  //initialValue is the value that is passed to the input element when the component is first rendered
        isTouched: false,
        isValid: props.initialValid || false //initialValid is the value that is passed to the input element when the component is first rendered
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        dispatch({ 
            type: 'CHANGE', 
            val: event.target.value, 
            validators: props.validators
        });
    };

    const touchHandler = () => {
        dispatch({type: 'TOUCH'});
    };

    const element = 
    props.element === 'input' ? (
        <input id={props.id} 
            type={props.type} 
            placeholder={props.placeholder} 
            onChange={changeHandler}

            //onBlur is triggered when the input element loses focus 
            //this means the user has entered the input and then clicked outside of the input element
            //a good indicator that the user has finished entering the input
            onBlur={touchHandler}
            value={inputState.value}
        /> 
    ) : (
      <textarea 
        id={props.id} 
        rows={props.row || 3}
        onChange={changeHandler}

        //onBlur is triggered when the input element loses focus 
        //this means the user has entered the input and then clicked outside of the input element
        //a good indicator that the user has finished entering the input
        onBlur={touchHandler} 
        value={inputState.value}
      />
    ); 



    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 
            'form-control--invalid'}`}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;