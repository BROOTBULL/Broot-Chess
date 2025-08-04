import { useUserContext } from "../hooks/contextHook"

export const Profile=()=>{
    const {user}=useUserContext();

    return(<>
      <div className="flex flex-row items-end Profile h-fit w-full mb-2 py-1">
          <div className="Profile bg-zinc-800 size-15 p-1 rounded-md">
            <img className="rounded-sm" src={user?.profile?user?.profile:"/media/chessboard.png"} alt="" />
          </div>
          <span className="text-zinc-800 text-3xl p-2 font-[800]">{user?.name}</span>
        </div>
        </>)
}

export const Profile2=()=>{
    const {user}=useUserContext();

    return(<>
      <div className="flex flex-row items-end Profile h-fit w-full mb-2 bg-zinc-500 rounded-lg p-2 md:p-5 ">
          <div className="Profile bg-zinc-800 size-35 md:size-55 p-1 rounded-md">
            <img className="rounded-sm" src={user?.profile?user?.profile:"/media/chessboard.png"} alt="" />
          </div>
          <div className="text-zinc-100 drop-shadow-sm/90 text-3xl md:text-5xl p-2 font-[900]">{user?.name}</div>
        </div>
        </>)
}