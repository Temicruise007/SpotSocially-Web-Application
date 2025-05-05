import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';


import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';


const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlaces] = useState();
    const placeId = useParams().placeId;
    const history = useHistory();
    // useHistory() is a react-router-dom hook that gives you access to the history object
    // history object allows you to programmatically navigate the user to a different route
    // history.push() is used to redirect the user to a different page
    // history.push('/') redirects the user to the homepage
    // history.push(`/places/${placeId}`) redirects the user to the place detail page
    // history.goBack() redirects the user to the previous page
    

    const [formState, inputHandler, setFormData] = useForm(
        {
          title: {
            value: '',
            isValid: false
          },
          description: {
            value: '',
            isValid: false
          }
        },
        false
    );

    // using useEffect to send a request to the backend to get the place data for the identified place when the component renders
    // and when the placeId changes (when the user navigates to a different place) 
    // useEffect() ensures that we send a requests when this component renders, but not re-render
    // useEffect() runs when the component renders and when the placeId changes
    useEffect(() => {
        const fetchPlace = async () => {
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                setLoadedPlaces(responseData.place);
                setFormData({
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, 
                true 
                );
            }
            catch(err) {
                // Error is handled by the hook, so no need to handle it here
            }
        };
        fetchPlace();
    }, [sendRequest, placeId, setFormData]); // Include sendRequest, placeId, setFormData as dependencies of useEffect hook.
   
    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('title', formState.inputs.title.value);
        formData.append('description', formState.inputs.description.value);

        //Append image only if a new one was provided
        if(formState.inputs.image && formState.inputs.image.value){
            formData.append('image', formState.inputs.image.value);
        }

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                formData,
                {
                    // Remove 'Content-Type' header so the browser can set it to multipart/form-data automatically
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/' + auth.userId + '/places');
        }
        catch(err) {
            // Error is handled by the hook, so no need to handle it here
        }  
    };


    if(isLoading) {
        return (
            <div className="center">
                <Card>
                <LoadingSpinner />
                </Card>
            </div>
        );
    }

    if(!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        );
    }

    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            { !isLoading && loadedPlace && (
                <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                    <Input 
                        id="title" 
                        element="input"
                        type="text" 
                        label="Title" 
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={formState.inputs.title.value}
                        initialValid={formState.inputs.title.isValid}
                    />
                    <Input 
                        id="description" 
                        element="textarea"
                        label="Description" 
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (a minimum 5 characters)."
                        onInput={inputHandler}
                        initialValue={formState.inputs.description.value}
                        initialValid={formState.inputs.description.isValid}
                    />
                    <ImageUpload 
                        id="image"
                        onInput={inputHandler}
                        center
                        errorText="Please provide an image."
                        // Optionally display the current image as a preview:
                        initialImage={loadedPlace.image}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE PLACE
                    </Button>
                </form>
                )}
        </React.Fragment>
    );
};

export default UpdatePlace;