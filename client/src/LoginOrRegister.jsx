import { useContext, useState } from "react";
import { UserContext } from "./Context";
import axios from "axios";

function LoginOrRegister() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");

    const { setUserId, setNewUsername } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(isLoginOrRegister, {username, password}).then(res => {
            setUserId(res.data._id);
            setNewUsername(res.data.username);
        }).catch(err => {
            console.log(err)
        });
    }
    
    return ( 
        <div className="bg-blue-50 w-full h-screen flex justify-center">
            <div className="w-72 mt-48 text-center">
                <h1 className="text-3xl uppercase font-bold text-blue-500 mb-3">Mern Chat</h1>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={username}
                        placeholder="Tài khoản" 
                        className="p-2 my-1.5 border rounded-sm outline-none" 
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password"
                        value={password}
                        placeholder="Mật khẩu" 
                        className="p-2 my-1.5 border rounded-sm outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 mt-1.5 rounded-sm">
                        {isLoginOrRegister === "login" ? "Đăng nhập" : "Đăng kí"}
                    </button>
                </form>
                {isLoginOrRegister === "login" && (
                    <span className="block m-2">
                        Bạn chưa có tài khoản?
                        <button className="ml-1" onClick={() => setIsLoginOrRegister("register")}>Đăng kí</button>
                    </span>
                )}
                {isLoginOrRegister === "register" && (
                    <span className="block m-2">
                        Bạn đã có tài khoản?
                        <button className="ml-1" onClick={() => setIsLoginOrRegister("login")}>Đăng nhập</button>
                    </span>
                )}
            </div>
        </div>
    );
}

export default LoginOrRegister;