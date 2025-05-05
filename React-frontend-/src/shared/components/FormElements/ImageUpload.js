import React, { useRef, useState, useEffect} from 'react';

import './ImageUpload.css';
import Button from './Button';
import Button2 from './Button2';

const ImageUpload = props => {

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if(!file){
            return;
        }
        const fileReader = new FileReader(); //FileReader() is a built-in browser API that allows us to read files stored on the user's computer.
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file, isValid]);

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        // event.target.files --- This holds the filse that user selected
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true); //does not update the state immediately, so we need to store it in a variable and then update the state with that variable value
            fileIsValid = true;
        }else{
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
       filePickerRef.current.click();
    };

    return(
        <div className="form-control"> 
            <input 
                id={props.id} 
                ref={filePickerRef}
                style={{display: 'none'}} 
                type="file" 
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='Preview' />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button2
                    type="button" 
                    rounded
                    size="small"
                    onClick={pickImageHandler}
                >
                </Button2>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;