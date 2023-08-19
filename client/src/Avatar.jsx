function Avatar({userId ,username, online}) {

    const colors = ["bg-teal-200", "bg-red-200", "bg-green-200", "bg-purple-200", "bg-blue-200", "bg-yellow-200"];
    const userIdBase10 = parseInt(userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={"w-9 h-9 rounded-full relative flex items-center justify-center " + color}>
            {online && <span className="w-2 h-2 bg-green-400 rounded-full absolute right-0 bottom-0 border-white"></span>}
            <p className="uppercase text-gray-500">{username[0]}</p>
        </div>
    )
}

export default Avatar;