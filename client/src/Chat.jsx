import { useContext } from "react";
import { UserContext } from "./Context";

function Chat() {

    const { newUsername } = useContext(UserContext);

    return (
        <>
            <h1>Xin chào: {newUsername}</h1>
            <h1>Chat tại đây !!!</h1>
        </>
    );
}

export default Chat;