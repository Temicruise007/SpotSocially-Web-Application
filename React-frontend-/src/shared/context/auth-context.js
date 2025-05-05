import { createContext } from "react";
//import user from "../../../../Node-backend-/models/user";

export const AuthContext = createContext({ 
    isLoggedIn: false, 
    userId: null,
    token: null,
    login: () => {}, 
    logout: () => {} 
});