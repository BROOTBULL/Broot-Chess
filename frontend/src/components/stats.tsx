import { useChessContext } from "../hooks/contextHook"

export const Stats=()=>{
    const {user}=useChessContext();

    return(<>
      <div className="flex flex-col w-full h-fit bg-zinc-800 text-zinc-200 lg:my-5 ring-1 ring-black shadow-lg/40">
        <div className=" text-2xl cursor-default font-bold m-2" >Stats</div>
          <div className="text-md font-[500] cursor-default ring-1 ring-black">
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="../../public/media/game.png" alt="" /> Games <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="../../public/media/blitz.png" alt="" />Blitz <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="../../public/media/sun.png" alt="" />Daily <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="../../public/media/stopwatchG.png" alt="" />Rapivd <span className="ml-auto">{user?.rating}</span></div>
          </div>
        </div>
        </>)
}