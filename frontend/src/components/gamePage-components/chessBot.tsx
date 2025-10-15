import { Chess } from "chess.js";
import { useChessContext, useUserContext } from "../../hooks/contextHook";

export const ChessBot = () => {
  const {
    moves,
    color,
    setColor,
    setChess,
    setBoard,
    setGameStarted,
    setGameEnded,
    setGameStatus,
    setPlayerWon,
    chess,
    setShowHint,
  } = useChessContext();
  const { isPlayingBot, setIsPlayingBot } = useUserContext();

  const handleHint = () => {
    setShowHint(true);

    setTimeout(() => {
      setShowHint(false);
    }, 5000);
  };

  return (
    <>
      <div className="p-3 h-full bg-zinc-700 max-w-[1000px] w-full flex flex-col gap-2 drop-shadow-[0_0_20px_black] rounded-lg rounded-tl-none">
        {isPlayingBot ? (
          <>
            <div className="bg-radial from-zinc-900 to-black h-[30%] min-h-[160px] rounded-md w-full relative">
              <img
                src="/media/chessRobot.png"
                className="size-35 absolute bottom-0 brightness-75"
                alt=""
              />
            </div>
            <div className="h-10 w-full flex flex-row items-center gap-3 ">
              <button
                onClick={() => {
                  setGameStarted(false);
                  setGameEnded(true);
                  setGameStatus("Checkmate");
                  setPlayerWon("Opponent");
                  chess.reset();
                }}
                className="size-9 rounded-sm bg-rose-950 drop-shadow-md ring ring-rose-700 "
              >
                <img
                  src="/media/logout.png"
                  className="size-6 invert flex mx-auto"
                  alt=""
                />
              </button>
              <button
                onClick={handleHint}
                className="bg-yellow-700/80 ml-auto hover:brightness-90 brightness-75 size-9 rounded-sm ring ring-yellow-400 flex items-center justify-center mr-5 text-sm font-bold text-white duration-200 cursor-pointer text-shadow-[0_0_4px_black]"
              >
                Hint
              </button>
              <button className="size-9 rounded-sm bg-zinc-600 drop-shadow-md ring ring-zinc-400 flex items-center justify-center">
                <img src="/media/takeback.png" className="size-6" alt="" />
              </button>
              <button className="size-9 rounded-sm bg-zinc-600 drop-shadow-md ring ring-zinc-400 flex items-center justify-center">
                <img
                  src="/media/takeback.png"
                  className="size-6 rotate-y-180"
                  alt=""
                />
              </button>
            </div>
            <div className="flex flex-col mt-auto Profile flex-1 min-h-[300px] w-full bg-zinc-900 rounded-md overflow-clip ">
              <div className="flex flex-row items-center bg-zinc-800 text-sm font-[500] text-center ">
                <div className="flex items-center justify-center h-8 text-sm   text-zinc-200 flex-5">
                  White Moves
                </div>
                <div className="flex items-center justify-center h-8 text-sm  bg-black text-zinc-200 flex-5">
                  Black Moves
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
                      </div>
                      <div className="border-b-1 border-zinc-800 w-[95%] flex mx-auto" />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-900 rounded-lg px-2 overflow-hidden duration-300 w-full h-fit">
            <div className="flex flex-row items-center gap-2 m-2">
              <div className="text-zinc-200 text-lg">Play as :</div>

              <div className="flex flex-row gap-2 my-2 ">
                <button
                  onClick={() => setColor("w")}
                  className={`size-14 bg-zinc-600 inset-ring-green-700 ${
                    color === "w" ? "inset-ring-4" : ""
                  } flex items-center justify-center cursor-pointer shadow-sm/40 rounded-lg hover:bg-zinc-500 duration-200`}
                >
                  <img
                    src="/media/pieces/kw.png"
                    className="size-11.5 p-1.5 drop-shadow-sm/90 ring-2  ring-zinc-400 rounded-sm"
                    alt=""
                  />
                </button>
                <button
                  onClick={() => setColor("b")}
                  className={`size-14 bg-zinc-600 flex items-center inset-ring-green-700 ${
                    color === "b" ? "inset-ring-4" : ""
                  }  justify-center cursor-pointer shadow-sm/40 rounded-lg hover:bg-zinc-500 duration-200`}
                >
                  <img
                    src="/media/pieces/kb.png"
                    className="size-11.5 p-1.5 drop-shadow-sm/30 ring-2 ring-zinc-900 rounded-sm"
                    alt=""
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPlayingBot(true);
                setGameStarted(true);
                const newGame = new Chess();
                setChess(newGame);
                setBoard(newGame.board());
              }}
              className={`bg-emerald-900 w-full rounded-md hover:bg-emerald-900/80 text-zinc-200 duration-200 h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50 my-3`}
            >
              <div className={`font-serif font-bold text-3xl drop-shadow-sm`}>
                Start Game
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
