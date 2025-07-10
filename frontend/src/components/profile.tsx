import { useChessContext } from "../hooks/contextHook"

export const Profile=()=>{
    const {user}=useChessContext();

    return(<>
      <div className="flex flex-row items-center Profile h-fit w-full mb-2 py-1 ">
          <div className="Profile bg-zinc-800 size-13 p-1 ">
            <img src="../../public/media/chessboard.png" alt="" />
          </div>
          <span className="font-serif text-zinc-800 text-2xl p-2 font-[900]">{user?.name}</span>
        </div>
        </>)
}