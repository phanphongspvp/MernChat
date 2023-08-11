import { createContext, useState } from "react";

const UserContext = createContext();

function Context({children}) {

    const [userId, setUserId] = useState("");
    const [newUsername, setNewUsername] = useState("");

    return ( 
        <UserContext.Provider value={{userId, setUserId, newUsername, setNewUsername}}>
            {children}
        </UserContext.Provider>
    );
}

export { Context, UserContext };