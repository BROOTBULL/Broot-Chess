export const GameHistory=()=>{

    return(<>
      <div className="flex flex-col Profile h-full w-full mt-8 bg-zinc-800">
        <div className="flex text-zinc-200 text-md lg:text-2xl lg:p-2  font-bold m-2 cursor-default">Game History</div>
        <div className="flex flex-col Profile h-50 w-full  bg-zinc-900">
        <div className="font-serif flex flex-row text-zinc-200 bg-zinc-950 text-sm font-[500] p-1 gap-2 text-center ">
            <div className="flex-1">Time</div>
            <div className="flex-4">Player</div>
            <div className="flex-1">Result</div>
            <div className="flex-2">Date</div>
            <div className="flex-1 hidden md:flex">Rematch</div>
        </div>
     </div>

    </div>
        </>)
}