import React from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';

//this is the component which is used to display the list of users
const UsersList = props => {

    //if the array is empty then it will return the
    //message that no users found
    if(props.items.length === 0){
        return(
            <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }

    //if the array is not empty then it will return the 
    //user list with the user details like id, image, name, placeCount
    return (
        <ul className='users-list'>
            {
            //here we are passing the user array to the UserItem.js
            //we are passing the id, image, name, placeCount to the UserItem.js
            }
            {props.items.map(user => (
                <UserItem 
                    key={user.id} 
                    id={user.id} 
                    image={user.image} 
                    name={user.name} 
                    placeCount={user.places.length}/>
            ))}
        </ul>
    );
};

export default UsersList;