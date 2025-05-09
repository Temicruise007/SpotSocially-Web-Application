import React, {useState, useContext} from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const PlaceItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true)
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false)
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        //console.log('DELETING...');
        //need to send an HTTP request to delete the place
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
                'DELETE',
                null,
                { Authorization: 'Bearer ' + auth.token }
            );
            props.onDelete(props.id);
        } catch (err){
            // error is handled by the hook so no need to handle it here
        }

    };

    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Modal 
            show={showMap} 
            onCancel={closeMapHandler} 
            header={props.address} 
            contentClass='place-item__modal-content' 
            footerClass='place-item__modal-actions'
            footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
        >
            <div className='map-container'>
                <Map center={props.coordinates} zoom={16} />
            </div>
        </Modal>
        <Modal 
            show={showConfirmModal}
            header="Are you sure?" 
            footerClass="place-item__modal-actions" 
            footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
            }>
               <p style={{ fontWeight: 'bold' }}>
                    Do you want to proceed and delete this 
                    place? Please note that this action 
                    can't be undone.
                </p>
        </Modal>
       <li className='place-item'>
            <Card className='place-item__content'>
                {isLoading && <LoadingSpinner asOverlay/>}
                <div className='place-item__image'>
                    <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.tiltle} />
                </div>
                <div className='place-item__info'>
                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                </div>
                <div className='place-item__actions'>
                    <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                    
                    {
                    //only when auth.isLoggedIn is true is when the EDIT button will be visible(what we did previously --> auth.isLoggedIn && .....so on)
                    //only when auth.userId is equal to the creatorId is when the EDIT button will be visible (what we do now)
                    }
                    {auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
                    
                    {
                    //only when auth.isLoggedIn is true is when DELETE the button will be visible
                    }
                    {auth.userId === props.creatorId &&  <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
                   
                </div>
            </Card>
       </li>
       </React.Fragment>

    );
};

export default PlaceItem;