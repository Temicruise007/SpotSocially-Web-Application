import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
  
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //1 hour
      setTokenExpirationDate(tokenExpirationDate);
      //set the timeout to logout the user after 1 hour
      logoutTimer = setTimeout(logout, tokenExpirationDate.getTime() - new Date().getTime());
      //store the user data in local storage
      localStorage.setItem(
        'userData', 
        JSON.stringify({ 
          userId: uid, 
          token: token, 
          expiration: tokenExpirationDate.toISOString() 
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if(token && tokenExpirationDate) {
        //remaining time for the token to be valid
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime)
      }
      else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);
  
    useEffect(()=> {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if(
          storedData && 
          storedData.token && 
          new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
          }
    }, [login]);

    //hooke should return an object with the values we want to use in the components
    return { token, login, logout, userId };
};

export default useAuth;