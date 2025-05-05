/* React is a JavaScript library for building user interfaces.
useState is a React "hook" that lets us add state (changing data) to our component.
useContext is another hook that lets us use context, which is a way to share data 
(like a user's login state) across the app without passing it down through every component. */
import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { 
    VALIDATOR_EMAIL,
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH 
} from '../../shared/util/validators';

/* useForm is a custom hook that helps manage form data.
AuthContext is a context that likely holds authentication 
data, like whether the user is logged in. */
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);



    /*  This function toggles between login and signup modes.
        if (!isLoginMode) {...} checks if we’re in signup mode (not login mode).
        It removes the name field if we’re switching to login mode, as login might not need a name.
        else {...} adds a name field to the form if we’re switching to signup mode.
        Finally, setIsLoginMode flips the mode by setting isLoginMode to the opposite of what it was before. */
    const switchModeHandler = () => {
        if(!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                }, 
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode); //fuction formula for updating the state based on the previous state
    };


    /* authSubmitHandler is the function that runs when the 
    user submits the form. The async keyword means we’re handling 
    something that takes time, like sending data to a server. */
    const authSubmitHandler = async event => {

        /* This function is called when the form is submitted. It prevents the default
        form submission behavior (which would reload the page) and sends a request to
        the server to log in or sign up. */
        event.preventDefault();


        if(isLoginMode){
            try{
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                    
                );

                auth.login(responseData.userId, responseData.token);
            } catch (err) {
                // Error is handled by the hook, so no need to handle it here
            }
        }else { 
            try{
                
                /* FormData is a built-in browser API that allows us to combine form data and files and send them to the server in a single request body (like a form submission).
                FormData is a constructor function, so we create a new instance of it with new FormData(). This creates a new FormData object that we can use to store form data.
                 FormData.append() adds a new field to the form data. The first argument is the field name, and the second argument is the field value. 
                We append each field to the FormData object, including the image file.
                We then send the FormData object to the server as the body of the request.
                We don’t need to set the Content-Type header because the browser will automatically set it to multipart/form-data when we send FormData.
                We also don’t need to use JSON.stringify() because FormData is a special object that can be sent directly to the server. */
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value); //image is a file, so we can't use JSON.stringify to convert it to a string value to send to the server as JSON data

                const responseData = await  sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users/signup',
                    'POST',
                    formData,
                );

              /* Finally, after a successful signup or login, we call auth.login() to 
              update the authentication state, which likely logs in the user and changes 
              the app’s behavior to reflect their logged-in status. */
              auth.login(responseData.userId, responseData.token);
            } catch (err) {
                // Error is handled by the hook, so no need to handle it here
            }

        }

    };  


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input 
                            element="input" 
                            id="name" 
                            type="text" 
                            label="Your Name" 
                            validators={[VALIDATOR_REQUIRE()]} 
                            errorText="Please enter a name." 
                            onInput={inputHandler} 
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload 
                            center 
                            id="image" 
                            onInput={inputHandler}
                            errorText="Please provide an image."
                        />
                    )}
                    <Input 
                        element="input" 
                        id="email" 
                        type="email" 
                        label="E-Mail" 
                        validators={[VALIDATOR_EMAIL()]} 
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input 
                        element="input" 
                        id="password" 
                        type="password" 
                        label="Password" 
                        validators={[VALIDATOR_MINLENGTH(6)]} 
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />
                    <Button type="submit" rounded disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button rounded inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
)};

export default Auth;