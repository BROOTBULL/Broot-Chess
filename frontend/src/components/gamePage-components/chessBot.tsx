import { Chess } from "chess.js";
import { useChessContext, useUserContext } from "../../hooks/contextHook";
import { useState } from "react";

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
    setStockFishDepth,
  } = useChessContext();
  const { isPlayingBot, setIsPlayingBot } = useUserContext();
  const trophies = [
    "bronz",
    "silver",
    "gold",
    "diamond",
    "platinum",
    "crown",
    "legend",
  ];
  const [selectedLevel, setSelectedLevel] = useState(1);
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
              <div className="flex flex-row items-center bg-zinc-800 text-sm font-[500] text-center  ">
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
          <div className="bg-zinc-900 rounded-lg px-2 overflow-hidden duration-300 w-full h-full">
            <div className="flex flex-col gap-2 h-fit ring-1 ring-zinc-700 rounded-md mt-2 p-2 ">
              <div className="text-zinc-200 text-base">Play As :</div>

              <div className="flex flex-row gap-3 my-2 justify-center ">
                <button
                  onClick={() => setColor("w")}
                  className={`size-30 flex-col inset-ring-green-500 ${
                    color === "w" ? "inset-ring-1 bg-green-700/10" : ""
                  } flex items-center justify-center cursor-pointer border-1 border-zinc-700 shadow-sm/40 rounded-lg hover:scale-102 duration-200`}
                >
                  <img
                    src="/media/pieces/kw.png"
                    className="size-11.5 p-1.5 drop-shadow-[0_0_20px_white] rounded-sm"
                    alt=""
                  />
                  <div className="text-zinc-100 font-bold text-sm text-shadow-sm/50">
                    White
                  </div>
                  <div className="text-zinc-500 text-[8px]">First Move</div>
                </button>
                <button
                  onClick={() => setColor("b")}
                  className={`size-30 flex-col border-1 border-zinc-700 flex items-center inset-ring-green-500 ${
                    color === "b" ? "inset-ring-1 bg-green-700/10" : ""
                  }  justify-center cursor-pointer shadow-sm/40 rounded-lg hover:scale-102 duration-200`}
                >
                  <img
                    src="/media/pieces/kb.png"
                    className="size-11.5 p-1.5 drop-shadow-[0_0_20px_white] rounded-sm"
                    alt=""
                  />
                  <div className="text-zinc-100 font-bold text-sm text-shadow-sm/50">
                    Black
                  </div>
                  <div className="text-zinc-500 text-[8px]">Second Move</div>
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
              className={`bg-emerald-800 w-full rounded-md hover:bg-emerald-900/80 text-white duration-200 h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50 my-3`}
            >
              <div className={`font-bold text-3xl drop-shadow-sm`}>
                Start Game
              </div>
            </button>

            <div className="flex flex-col gap-2 h-fit ring-1 ring-zinc-700 rounded-md mt-2 p-2 ">
              <div className="text-zinc-200 text-base">Difficulty Level :</div>

              <div className="flex flex-row gap-2 my-2 flex-wrap  justify-center ">
                {Array.from({ length: 7 }).map((_, i) => {
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedLevel(i);
                        setStockFishDepth((i + 1) * 3);
                      }}
                      className={`h-20 w-40 flex-row inset-ring-green-500 ${i==selectedLevel?"inset-ring-1 bg-green-700/10":"bg-radial from-zinc-800 to-zinc-900"} drop-shadow-xl/10 flex items-center justify-center cursor-pointer border-1 border-zinc-700 shadow-sm/40 rounded-lg hover:scale-102 duration-200`}
                    >
                      <img
                        src={`/media/${trophies[i]}.png`}
                        className="size-11.5 p-1.5 rounded-sm"
                        alt=""
                      />
                      <div className="flex flex-col ">
                        <div className="text-zinc-100 font-bold text-sm text-shadow-sm/50">
                          {"Level : "}
                          {i + 1}
                        </div>
                        <div className="text-zinc-500 text-[10px]">
                          {`${(1 + i) * 200} - ${(1 + i) * 200 + 200}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
