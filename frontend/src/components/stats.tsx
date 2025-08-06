import { useUserContext } from "../hooks/contextHook"

export const Stats=()=>{
    const {user}=useUserContext();

    return(<>
      <div className="flex flex-col h-fit bg-zinc-800 text-zinc-200 my-2 md:my-5 ring-1 ring-black shadow-lg/40 w-full md:max-w-60 rounded-lg">
        <div className=" lg:text-2xl cursor-default font-bold m-2" >Stats</div>
          <div className="text-md font-[500] cursor-default ring-1 ring-black rounded-b-lg">
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="./media/game.png" alt="" /> Games <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="./media/blitz.png" alt="" />Blitz <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="./media/classical.png" alt="" />Daily <span className="ml-auto">{user?.rating}</span></div>
            <div className="m-4 mx-2 flex flex-row gap-3"><img className="size-6" src="./media/rapid.png" alt="" />Rapid <span className="ml-auto">{user?.rating}</span></div>
          </div>
        </div>
        </>)
}