import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { UserContext } from "./Context";
import Avatar from "./Avatar";

function Chat() {

    const { userId, newUsername } = useContext(UserContext);


    const [chat, setChat] = useState("");
    const [newChat, setNewChat] = useState("");
    const [isChat, setIsChat] = useState(false);
    const [userData, setUserData] = useState([]);
    const [userOnline, setUserOnline] = useState([]);
    const [userOffline, setUserOffline] = useState([]);
    const [selectId, setSelectId] = useState(null);
    const chatScroll = useRef(null);
    
    useEffect(() => {
        if (chatScroll.current) {
          chatScroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [newChat]);

    useEffect(() => {
        connectWs();
    }, []);

    
    useEffect(() => {
        axios.get("/users")
            .then(res => {
                const userDataOffline = _.differenceWith(res.data, userOnline, (a, b) => a._id === b.userId);
                setUserOffline(userDataOffline);
            })
            .catch((error) => {
                console.error("Có lỗi trong quá trình lấy dữ liệu: ", error);
            })
    }, [userOnline]);

    const connectWs = () => {
        const ws = new WebSocket("ws://localhost:5000");

        ws.addEventListener("message", handleMessage);
    }

    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data);
        if("online" in messageData) {
            console.log(messageData.online);
            const wsUserOnline = _.uniqBy(messageData.online, "userId");
            setUserOnline(wsUserOnline)
        } 
    }

    const handleChat = (id) => {
        setIsChat(true);
        setSelectId(id);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setChat("");
        setNewChat(chat);
    }

    return (
        <div className="flex w-full h-screen">
            <div className="w-1/3 gap-1 flex flex-col">
                <div className="flex-grow">
                    <div className="border-b h-12 bg-blue-600 flex items-center text-white pl-6 font-semibold">Mern Chat</div>
                    {/* Hiển thị ra người dùng online */}
                    {userOnline.map((user) => (
                        <div 
                            key={user.userId} 
                            className={`border-b h-14 flex items-center pl-4 cursor-pointer ${selectId === user.userId ? "bg-blue-200" : ""}`} 
                            onClick={() => handleChat(user.userId)}
                        >
                            <Avatar userId={user.userId} username={user.username} online={true} />
                            <p className="text-gray-600 ml-2">{user.username}</p>
                        </div>
                    ))}
                    {/* Hiển thị ra người dùng offline */}
                    {userOffline.map((user) => (
                        <div 
                            key={user._id} 
                            className={`border-b h-14 flex items-center pl-4 cursor-pointer ${selectId === user._id ? "bg-blue-200" : ""}`} 
                            onClick={() => handleChat(user._id)}
                        >
                            <Avatar userId={user._id} username={user.username} online={false} />
                            <p className="text-gray-600 ml-2">{user.username}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center text-gray-500 mb-4">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        {newUsername}
                    </div>
                    <button className="ml-2 bg-gray-600 text-white px-2 py-1 rounded-sm">Đăng xuất</button>
                </div>
            </div>
            {!isChat && (
                <div className="w-2/3 bg-blue-100 flex flex-col justify-center items-center">
                    <span className="text-gray-500 text-sm">&larr;Hãy bấm vào một người để trò chuyện</span>
                </div>
            )}
            {isChat && (
                <div className="w-2/3 bg-blue-100 flex flex-col">
                    <div className="flex-grow overflow-y-scroll">
                    {/* {chats.map((chat) => {
                        if(chat.sender === selectId) {
                            return (
                                <div key={chat._id} className={chat.sender === selectId ? "text-right": "text-left"} ref={chatScroll}>
                                    <p className="bg-blue-600 text-white p-1 m-2 rounded-lg inline-block">{chat.text}</p>
                                </div>
                            )
                        }
                    })} */}
                    </div>
                    <form className="flex m-2 gap-2" onSubmit={handleSubmit}>
                        <input 
                            className="flex-grow p-2 border outline-none rounded-l-sm"
                            value={chat}
                            type="text" 
                            placeholder="Nhập tin nhắn của bạn"
                            onChange={(e) => setChat(e.target.value)}
                        />
                        <button className={`bg-blue-500 p-3 text-white rounded-r-sm ${chat === "" ? "opacity-50 cursor-not-allowed" : ""}`} disabled={chat === ""}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;