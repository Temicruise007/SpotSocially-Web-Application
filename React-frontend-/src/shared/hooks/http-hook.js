import { useState, useCallback, useRef, useEffect } from 'react';


export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);
  
    // useCallback is used to prevent infinite loops, also method, body, headers are set to default values initially
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });
        
        /*  This code checks if the server returned an error. If it did, we throw an error
        with the message from the server. This will be caught by the catch block below. */
        const responseData = await response.json();

        /* This code removes the abort controller from the list of active HTTP requests.
        This is important because we don’t want to keep controllers around for requests that
        have already been completed. */
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        
        //if the response is not ok, throw an error with the message from the server
        //this will be caught by the catch block below
        if (!response.ok) {
          throw new Error(responseData.message);
        }
  
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    }, []);
  
    const clearError = () => {
      setError(null);
    };

    useEffect(() => {
      return () => {
        activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
      };
    }, []);
  
    return { isLoading, error, sendRequest, clearError };
  };