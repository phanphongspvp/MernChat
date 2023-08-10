import { useState } from "react";

function LoginOrRegister() {

    const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");

    return ( 
        <div className="bg-blue-50 w-full h-screen flex justify-center">
            <div className="w-72 mt-48 text-center">
                <h1 className="text-3xl uppercase font-bold text-blue-500 mb-3">Mern Chat</h1>
                <form className="flex flex-col">
                    <input type="text" placeholder="Tài khoản" className="p-2 my-1.5 border rounded-sm outline-none" />
                    <input type="text" placeholder="Mật khẩu" className="p-2 my-1.5 border rounded-sm outline-none" />
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