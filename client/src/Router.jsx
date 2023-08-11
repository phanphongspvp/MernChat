import { useContext } from "react";

import LoginOrRegister from "./LoginOrRegister";
import Chat from "./Chat";
import { UserContext } from "./Context";

function Router() {

    const { newUsername } = useContext(UserContext);

    if(newUsername) {
        return <Chat />
    }

    return ( 
        <LoginOrRegister />
    );
}

export default Router;