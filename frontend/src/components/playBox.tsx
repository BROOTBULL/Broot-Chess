import { useChessContext } from "../hooks/contextHook";

export const Play = ({ moves }: { moves: string[] }) => {
  const { connecting } = useChessContext();

  if (connecting)
    return (
      <div className="p-3 h-full bg-zinc-700 flex justify-center items-center">
        <div className="text-zinc-200 font-bold text-lg">Connecting...</div>
      </div>
    );
  return (
    <>
    {console.log("move:",moves)
    }
      <div className="p-3 h-full bg-zinc-700">
        <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900">
          <div className="flex flex-row items-center bg-zinc-800 text-sm font-[500] text-center ">
            <div className="flex items-center justify-center h-10  text-zinc-200 flex-5">
              White Moves
            </div>
            <div className="flex items-center justify-center h-10 bg-black text-zinc-200 flex-5">
              Black Moves
            </div>
            <div className="flex items-center justify-center h-10 bg-emerald-950 text-zinc-200 flex-2">
              Time Taken
            </div>
          </div>

          {moves.map((_, i) => {
            if (i % 2 !== 0) return null; 
            return(
            <div key={i}>
              <div
                className="flex flex-row items-center text-sm font-[500] text-center m-1"
              >
                <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                  {moves[i]}
                </div>
                <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                  {moves[++i]}
                </div>
                <div className="flex flex-col items-center justify-center h-7 text-zinc-200 flex-2">
                  <div className="text-[10px] bg-zinc-700 w-[80%]">00:02</div>
                  <div className="text-[10px] bg-black w-[80%]">{moves[i]?"00:03":""}</div>
                </div>
              </div>
              <div className="border-b-1 border-zinc-800 w-[95%] flex mx-auto" />
            </div>
          )})}
        </div>
      </div>
    </>
  );
};
