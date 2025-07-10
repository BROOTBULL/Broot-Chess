import { useChessContext } from "../hooks/contextHook"

export const GameRatings=()=>{
    const {user}=useChessContext();
    
    return(<>
      <div className="flex flex-row items-center Profile h-fit w-full py-1 gap-3 max-w-[500px]">
          <div className="Profile md:flex-col bg-zinc-400 flex flex-row size-fit p-2 md:p-4 shadow-md/40">
            <img className="size-15 lg:size-25 drop-shadow-sm/90" src="../../public/media/stopwatchG.png" alt="" />

            <div className="flex flex-col md:text-center">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px]  absolute md:relative md:p-0 p-2 font-[600] ">Rapid</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-5 md:pt-0">{user?.rating}</span>
            </div>
          </div>

          <div className="Profile md:flex-col bg-zinc-400 flex flex-row size-fit p-2 md:p-4 shadow-md/40">
            <img className="size-15 lg:size-25 drop-shadow-sm/90" src="../../public/media/blitz.png" alt="" />

            <div className="flex flex-col md:text-center">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px]  absolute md:relative md:p-0 p-2 font-[600] ">Blitz</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-5 md:pt-0">{user?.rating}</span>
            </div>
          </div>
          <div className="Profile hidden md:flex flex-col bg-zinc-400 size-fit p-4 shadow-md/40">
            <img className="size-15 lg:size-25 drop-shadow-sm/90" src="../../public/media/sun.png" alt="" />

            <div className="flex flex-col md:text-center ">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px]  absolute md:relative md:p-0 p-2 font-[600] ">Daily</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-5 md:pt-0">{user?.rating}</span>
            </div>
          </div>

        </div>
        </>)
}