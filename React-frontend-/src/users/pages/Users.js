// Users.js
import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();  // Use the hook
  const [loadedUsers, setLoadedUsers] = useState();

  /* 
  useEffect hook allow us to run certain code only when certain dependencies change.
  the code that runs is defined in our function which is our first argument, the second
  argument is an array of dependencies (so of data that needs to change for this to re-run). 
  If the array is empty, then the code will only run once when the component is rendered.(it'll never re-run). */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users'); // Use sendRequest from the hook
        setLoadedUsers(responseData.users);
      } catch (err) {
        // Error is handled by the hook, so no need to handle it here
      }
    };
    fetchUsers();
  }, [sendRequest]);  // Include sendRequest as a dependency

  return ( 
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;