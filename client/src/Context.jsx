import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function Context({children}) {

    const [userId, setUserId] = useState(null);
    const [newUsername, setNewUsername] = useState(null);

    useEffect(() => {
        axios.get('/profile').then(response => {
            setUserId(response.data.userId);
            setNewUsername(response.data.username);
        });
      }, []);


    return ( 
        <UserContext.Provider value={{userId, setUserId, newUsername, setNewUsername}}>
            {children}
        </UserContext.Provider>
    );
}

export { Context, UserContext };