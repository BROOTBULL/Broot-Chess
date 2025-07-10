import { useChessContext } from "../hooks/contextHook";

export const Play = () => {
    const {connecting}=useChessContext()

    if (connecting) return <div className="p-3 h-full bg-zinc-700 flex justify-center items-center"><div className="text-zinc-200 font-bold text-lg">Connecting...</div></div>;
  return (
    <>
      <div className="p-3 h-full bg-zinc-700">
        <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900 justify-between">
          <div className="flex flex-row items-center bg-zinc-800 text-sm font-[500] p-2 gap-2 text-center ">
            <div className=" text-zinc-200 flex-1">White Moves</div>
            <div className=" text-zinc-400 flex-1">Black Moves</div>
            <div className=" text-zinc-200 flex-1">Time Taken</div>
          </div>
          <div className=" flex flex-row items-center text-zinc-200 bg-zinc-800 text-sm font-[500] p-2 gap-2 text-center "></div>
        </div>
      </div>
    </>
  );
};
