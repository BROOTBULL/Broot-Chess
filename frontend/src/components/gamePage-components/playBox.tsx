import { useChessContext } from "../../hooks/contextHook";
import { MessageBox } from "./messagebox";
import { SearchingLoader } from "../../assets/loader";
import { GameControl } from "./gameControl";

export const Play = () => {
  const { connecting, moves } = useChessContext();

  if (connecting) return <SearchingLoader />;

  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  return (
    <>
      {console.log()}

      <div className="p-3 h-full bg-zinc-700 max-w-[1000px] w-full">
        <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900">
          <div className="flex flex-row items-center bg-zinc-800 text-sm font-[500] text-center ">
            <div className="flex items-center justify-center h-8 text-sm   text-zinc-200 flex-5">
              White Moves
            </div>
            <div className="flex items-center justify-center h-8 text-sm  bg-black text-zinc-200 flex-5">
              Black Moves
            </div>
            <div className="flex items-center justify-center h-8 text-[8px]  bg-emerald-950 text-zinc-200 flex-2">
              Time Taken
            </div>
          </div>
          <div className="min-h-60 h-70 custom-scroll scroll-smooth overflow-auto">
            {moves.map((_, i) => {
              if (i % 2 !== 0) return null;
              const whiteMove = moves[i];
              const blackMove = moves[i + 1];
              return (
                <div key={i}>
                  <div className="flex flex-row items-center text-sm font-[500] text-center m-1">
                    <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                      {whiteMove.to}
                    </div>
                    <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                      {blackMove ? blackMove.to : ""}
                    </div>
                    <div className="flex flex-col items-center justify-center h-7 text-zinc-200 flex-2">
                      <div className="text-[10px] bg-zinc-700 w-[80%]">
                        {formatTime(whiteMove.timeTaken)}
                      </div>
                      <div className="text-[10px] bg-black w-[80%]">
                        {blackMove ? formatTime(blackMove.timeTaken) : ""}
                      </div>
                    </div>
                  </div>
                  <div className="border-b-1 border-zinc-800 w-[95%] flex mx-auto" />
                </div>
              );
            })}
          </div>

          <GameControl />
          <MessageBox />
        </div>
      </div>
    </>
  );
};
