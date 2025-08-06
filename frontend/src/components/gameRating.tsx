import { useUserContext } from "../hooks/contextHook"

export const GameRatings=()=>{
    const {user}=useUserContext();
    
    return(<>
      <div className="flex flex-row items-center Profile h-fit w-full md:w-[80%] py-1 gap-3 max-w-full justify-around min-[500px]:justify-start mt-auto my-1">
          <div className="Profile flex-col bg-zinc-400 flex size-fit p-3 px-5 shadow-md/40">
            <img className="size-16 lg:size-25 drop-shadow-sm/90" src="/media/stopwatchG.png" alt="" />

            <div className="flex flex-col text-center">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px] relative font-[600] ">Rapid</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-0">{user?.rating}</span>
            </div>
          </div>

          <div className="Profile flex-col bg-zinc-400 flex size-fit p-3 px-5 shadow-md/40">
            <img className="size-16 lg:size-25 drop-shadow-sm/90" src="/media/blitz.png" alt="" />

            <div className="flex flex-col text-center">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px] relative font-[600] ">Blitz</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-0">{user?.rating}</span>
            </div>
          </div>
          <div className="Profile flex flex-col bg-zinc-400 size-fit p-3 px-5 shadow-md/40">
            <img className="size-16 lg:size-25 drop-shadow-sm/90" src="/media/sun.png" alt="" />

            <div className="flex flex-col text-center ">
            <span className="font-serif text-zinc-800 text-[12px] lg:text-[16px] relative font-[600] ">Daily</span>
             <span className=" text-zinc-800 text-2xl p-2 font-[800] pt-0">{user?.rating}</span>
            </div>
          </div>

        </div>
        </>)
}