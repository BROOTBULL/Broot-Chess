import { useState } from "react";
import { useChessContext } from "../../hooks/contextHook";

type Tab = "newgame" | "history" | "friends" | "play" | "chessBot";
type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  socket: WebSocket;
  gameAlert: string | undefined;
  setGameAlert: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const NewGame = ({
  setActiveTab,
  socket,
  gameAlert,
  setGameAlert,
}: Props) => {
  const INIT_GAME = "init_game";
  const JOINROOM = "joinroom";
  // const NOTIFICATION="notification"

  const {
    gameType,
    setGameType,
    connecting,
    setConnecting,
    roomId,
    setPlayAgainstBot,
    MultiplayerGameStarted,
  } = useChessContext();

  const [playFriend, setPlayFriend] = useState(false);
  const [roomIdBox, setRoomIdBox] = useState(false);
  const [RoomType, setRoomType] = useState<boolean>(true);
  const [copy, setCopy] = useState(false);
  const [code, setCode] = useState("");

  function handleCopy() {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopy(true);
    }
  }

  function handleStartGame() {
    if (connecting) return;
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
        private: false,
        gameType: gameType,
      })
    );
    setActiveTab("play");
    setConnecting(true);
    setGameAlert(undefined);
  }

  function handleCreateRoom() {
    socket?.send(
      JSON.stringify({
        type: INIT_GAME,
        private: true,
        gameType: gameType,
      })
    );
    setRoomIdBox(true);
    setRoomType(true);
  }

  function joinRoom(e: React.SyntheticEvent) {
    e.preventDefault();
    // console.log("game sending");
    if (code)
      socket?.send(
        JSON.stringify({
          type: JOINROOM,
          payload: {
            roomId: code,
          },
        })
      );
    setActiveTab("play");
    setConnecting(true);
  }

  return (
    <>
      <div className="bg-zinc-700 rounded-lg rounded-tl-none drop-shadow-[0_0_20px_black] z-1 w-full min-h-[400px] h-full flex flex-col gap-3 p-3 max-w-[1000px]">
        <div
          className={`bg-zinc-900 rounded-lg px-2 ${
            !playFriend ? "max-h-100" : "max-h-0"
          } overflow-hidden duration-300`}
        >
          <div className="flex flex-row gap-2 my-2">
            <button
              onClick={() => setGameType("blitz")}
              className={` h-12 ${
                gameType === "blitz"
                  ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md`}
            >
              <img className="size-7" src="/media/blitz.png" alt="" />
              <div className={` text-zinc-200 text-lg `}>Blitz</div>
            </button>
            <button
              onClick={() => setGameType("rapid")}
              className={` h-12 ${
                gameType === "rapid"
                  ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md`}
            >
              <img className="size-7" src="./media/rapid.png" alt="" />
              <div className={` text-zinc-200 text-lg `}>Rapid</div>
            </button>
            <button
              onClick={() => setGameType("daily")}
              className={` h-12 ${
                gameType === "daily"
                  ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                  : "bg-zinc-800"
              } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md `}
            >
              <img className="size-7" src="/media/classical.png" alt="" />
              <div className={` text-zinc-200 text-lg `}>Daily</div>
            </button>
          </div>
          {gameAlert && (
            <div className="text-red-500 text-sm w-full text-center h-5">
              {gameAlert + " Try again.."}
            </div>
          )}
          <button
            onClick={() => handleStartGame()}
            className={`bg-emerald-900 hover:bg-emerald-900/80 w-full rounded-md text-zinc-200 duration-200 h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50 my-3`}
          >
            <div className={`font-serif font-bold text-3xl drop-shadow-sm`}>
              Start Game
            </div>
          </button>
        </div>
        <div className="bg-zinc-900 h-fit mt-5 flex flex-col items-center justify-center cursor-pointer w-full rounded-lg ">
          <div
            onClick={() => setPlayFriend(!playFriend)}
            className={`h-18  flex flex-row items-center rounded-lg shadow-md justify-center w-full ${
              playFriend ? "bg-black" : "bg-zinc-800"
            } playButton duration-300`}
          >
            <img className="size-8 m-1 " src="/media/friends.png" alt="" />
            <div className="font-serif text-zinc-100 text-lg md:text-2xl">
              Play a Friend
            </div>
          </div>
          <div
            className={` w-full flex flex-col justify-around px-2 gap-2 ${
              playFriend ? "max-h-50" : "max-h-0"
            } overflow-hidden duration-300`}
          >
            <div
              className={`flex flex-row gap-2 ${
                RoomType ? "max-h-50" : "max-h-0"
              } overflow-hidden duration-300 drop-shadow-sm/40`}
            >
              <div
                onClick={() => setGameType("blitz")}
                className={` h-12 ${
                  gameType === "blitz"
                    ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                    : "bg-zinc-800"
                } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md mt-2`}
              >
                <img className="size-7" src="/media/blitz.png" alt="" />
                <div className={` text-zinc-200 text-lg `}>Blitz</div>
              </div>
              <div
                onClick={() => setGameType("rapid")}
                className={` h-12 ${
                  gameType === "rapid"
                    ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                    : "bg-zinc-800"
                } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md mt-2`}
              >
                <img className="size-7" src="/media/rapid.png" alt="" />
                <div className={` text-zinc-200 text-lg `}>Rapid</div>
              </div>
              <div
                onClick={() => setGameType("daily")}
                className={` h-12 ${
                  gameType === "daily"
                    ? "inset-ring-1 inset-ring-emerald-700 bg-emerald-950"
                    : "bg-zinc-800"
                } flex flex-row items-center flex-1 justify-center cursor-pointer shadow-sm/40 rounded-md mt-2`}
              >
                <img className="size-7" src="/media/classical.png" alt="" />
                <div className={` text-zinc-200 text-lg `}>Daily</div>
              </div>
            </div>
            {gameAlert && (
              <div className="text-red-500 h-8 w-full text-center">
                {gameAlert}
              </div>
            )}
            <div className={`flex flex-row h-fit drop-shadow-md/50`}>
              <div
                onClick={handleCreateRoom}
                className={` h-15 flex flex-row items-center z-20 justify-center mb-3 mt-1 rounded-l-md w-full ${
                  !RoomType
                    ? "bg-zinc-800 text-zinc-500 "
                    : "bg-emerald-900 text-zinc-200 "
                }`}
              >
                Create Room
              </div>
              <div
                onClick={() => {
                  setRoomType(!RoomType);
                  setRoomIdBox(true);
                }}
                className={`h-15 flex flex-row items-center z-20 rounded-r-md justify-center w-full text-zinc-200 mb-3 mt-1 hover:bg-teal-900 ${
                  !RoomType ? "bg-emerald-900" : "bg-zinc-800"
                }`}
              >
                Join Room
              </div>
            </div>
          </div>
          <div
            className={`w-full ${
              roomIdBox ? "h-12" : "h-0"
            } duration-200 overflow-hidden`}
          >
            {RoomType ? (
              <div className=" h-full flex flex-row items-center shadow-md/50 justify-center w-full text-zinc-200">
                Invite Code: {roomId}{" "}
                <img
                  onClick={() => handleCopy()}
                  className="size-7 duration-200 mx-2 hover:bg-zinc-800 rounded-md p-1"
                  src={`./media/${copy ? "yes" : "copy"}.png`}
                  alt=""
                />
              </div>
            ) : (
              <form className=" h-full flex flex-row items-center shadow-md/50 justify-center gap-1 w-full ">
                <input
                  className="h-8 border-2 border-zinc-700 outline-0 focus:border-zinc-500 text-zinc-200 w-[80%] pl-2 rounded-sm"
                  placeholder="Enter invite code...."
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  onClick={(e) => joinRoom(e)}
                  className="bg-emerald-800 text-zinc-200 rounded-sm px-4 py-1.5 text-sm cursor-pointer hover:bg-emerald-900"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (!MultiplayerGameStarted) {
              setActiveTab("chessBot");
              setPlayAgainstBot(true);
            }
          }}
          className="bg-zinc-800 playButton rounded-lg h-18 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-full "
        >
          <img className="size-8 m-1 " src="/media/friends.png" alt="" />
          <div className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play a Bot
          </div>
        </button>
      </div>
    </>
  );
};
