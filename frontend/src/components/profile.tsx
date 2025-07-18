import { useChessContext } from "../hooks/contextHook"

export const Profile=()=>{
    const {user}=useChessContext();

    return(<>
      <div className="flex flex-row items-end Profile h-fit w-full mb-2 py-1 m-5 ">
          <div className="Profile bg-zinc-800 size-20 p-1 rounded-md">
            <img className="rounded-sm" src={user?.profile?user?.profile:"../../public/media/chessboard.png"} alt="" />
          </div>
          <span className="font-serif text-zinc-800 text-3xl p-2 font-[900]">{user?.name}</span>
        </div>
        </>)
}