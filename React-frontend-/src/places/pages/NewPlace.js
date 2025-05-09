import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceForm.css';


const NewPlace = () => {

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory()

    
    const placeSubmitHandler = async event => {
        event.preventDefault();
        try{
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + 'places', 
                'POST', 
                formData,
                { Authorization: 'Bearer ' + auth.token }
            );
          //Redirect the user to a different page
          history.push('/') //after successfully adding a new place, this line of code redirects users to the homepage.
        } catch(err){console.error(err);}
    };


    return( 
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <label></label>
                <Input 
                    id="title"
                    element="input" 
                    type="text" 
                    label="Title" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                />
                <Input 
                    id="description"
                    element="textarea" 
                    label="Descritption" 
                    validators={[VALIDATOR_MINLENGTH(5)]} 
                    errorText="Please enter a valid descritption (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input 
                    id="address"
                    element="input" 
                    label="Address" 
                    validators={[VALIDATOR_REQUIRE()]} 
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />
                <ImageUpload 
                    center 
                    id="image" 
                    onInput={inputHandler}
                    errorText="Please provide an image."
                />

                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
};


export default NewPlace;