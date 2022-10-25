export default function Message({children,avatar,username,description,id}){
    return (
        <div className="shadow-lg p-6 mb-4">
            <div className="flex gap-3 items-center mb-4">
                <img src={avatar} className="w-8 rounded-full" />
                <h1>{username}</h1>
            </div>
            <h2>{description}</h2>
            <div>{children}</div>
        </div>
    )
}