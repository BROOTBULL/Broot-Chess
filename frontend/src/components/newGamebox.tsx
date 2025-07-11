import { useChessContext } from "../hooks/contextHook";

type Tab = "newgame" | "history" | "friends" | "play";
type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  socket:WebSocket;
};

export const NewGame = ({setActiveTab,socket}:Props) => {


  const INIT_GAME = "init_game";

  const { gameType, setGameType,connecting,setConnecting} = useChessContext();

  function handleStartGame()
  {
              if (connecting) return;
              socket?.send(
                JSON.stringify({
                  type: INIT_GAME,
                })
              );
              setConnecting(true);
              setActiveTab("play")
  }

  return (
    <>
      <div className="bg-zinc-700 w-full min-h-[400px] h-full flex flex-col gap-3 p-3">
        <div className="bg-zinc-900 p-3">
          <div className="flex flex-row gap-2">
            <div
              onClick={() => setGameType("blitz")}
              className={` h-12 ${
                gameType === "blitz"
                  ? "ring-2 ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40`}
            >
              <img
                className="size-7"
                src="../../public/media/blitz.png"
                alt=""
              />
              <span className={` text-zinc-200 text-lg `}>Blitz</span>
            </div>
            <div
              onClick={() => setGameType("rapid")}
              className={` h-12 ${
                gameType === "rapid"
                  ? "ring-2 ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40`}
            >
              <img
                className="size-7"
                src="../../public/media/stopwatchG.png"
                alt=""
              />
              <span className={` text-zinc-200 text-lg `}>Rapid</span>
            </div>
            <div
              onClick={() => setGameType("daily")}
              className={` h-12 ${
                gameType === "daily"
                  ? "ring-2 ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 `}
            >
              <img className="size-7" src="../../public/media/sun.png" alt="" />
              <span className={` text-zinc-200 text-lg `}>Daily</span>
            </div>
          </div>
          <div
            onClick={()=>handleStartGame()}
            className={`${
              gameType === ""
                ? "bg-zinc-700 text-zinc-400 pointer-events-none"
                : "bg-emerald-900 text-zinc-200 "
            } duration-200 h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50 mt-5 `}
          >
            <span className={`font-serif font-bold text-3xl drop-shadow-sm`}>
              Start Game
            </span>
          </div>
        </div>
        <div className="bg-zinc-800 playButton h-18 mt-5 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-full ">
          <img
            className="size-8 m-1 "
            src="../../public/media/friends.png"
            alt=""
          />
          <span className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play a Friend
          </span>
        </div>
        <div className="bg-zinc-800 playButton h-18 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-full ">
          <img
            className="size-8 m-1 "
            src="../../public/media/friends.png"
            alt=""
          />
          <span className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play a Bot
          </span>
        </div>
      </div>
    </>
  );
};
