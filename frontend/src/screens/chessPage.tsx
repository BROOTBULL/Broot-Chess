import { useEffect, useState } from "react";
import { ChessBoard } from "../components/board";
import { PlayerInfo } from "../components/playerInfos";
import { Trasition } from "../transition";
import { Chess, Move, Square } from "chess.js";
import { useSocket } from "../hooks/sockets";
import axios from "axios";
import { useChessContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";
import { NewGame } from "../components/newGamebox";
import { History } from "../components/historyBox";
import { Friends } from "../components/friendsBox";
import { Play } from "../components/playBox";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_ENDED = "game_ended";

export function isPromoting(chess: Chess, from: Square, to: Square) {
  const piece = chess.get(from);

  if (!piece || piece.type !== "p") return false;

  // White pawn reaching 8th rank or black pawn reaching 1st
  return (
    (piece.color === "w" && to.endsWith("8")) ||
    (piece.color === "b" && to.endsWith("1"))
  );
}

const ChessGame = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [color, setColor] = useState("white");
  const [time, setTime] = useState(5);
  const [setting, setSetting] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);

  type Tab = "newgame" | "history" | "friends" | "play";

  const navigate = useNavigate();
  const {
    user,
    setUser,
    gameStarted,
    setGameStarted,
    setConnecting,
    Opponent,
    setOpponent,
    roomId,
    setRoomId,
  } = useChessContext();
  const { username, rating, profile } = user!;

  const [activeTab, setActiveTab] = useState<Tab>("newgame");
  const [gameEnded,setGameEnded]=useState(false)
  const [playerWon,setplayerWon]=useState<string|undefined>()

  const socket = useSocket(); //we are getting socket from customhook which is connected to backend
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:3000";

  useEffect(() => {
      if(gameEnded){
    const handleClick = () => {
      setGameEnded(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    } else {
      socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        const payload = message.payload;
        console.log("message recieved:", message);

        switch (message.type) {
          case INIT_GAME:
            {
              const newGame = new Chess();
              const isUser = payload.WhitePlayer.userId === user?.id;

              setChess(newGame);
              setBoard(newGame.board());
              setConnecting(false);
              setGameStarted(true);
              setOpponent(isUser ? payload.BlackPlayer : payload.WhitePlayer);
              setRoomId(payload.RoomId);
              console.log(
                "Game initialized ! You are : ",
                payload.color,
                "roomId:",
                payload.RoomId
              );
              setColor(isUser ? "white" : "black");
            }
            break;
          case MOVE:
            {
              const move = payload.move as Move;
              setMoves((prev) => [...prev, move.to]);

              try {
                if (isPromoting(chess, move.from, move.to)) {
                  chess.move({
                    from: move.from,
                    to: move.to,
                    promotion: "q",
                  });
                } else {
                  chess.move({ from: move.from, to: move.to });
                }
              } catch (error) {
                console.log("Error", error);
              }
              setBoard(chess.board());
              console.log("Move made :", move);
            }
            break;
          case GAME_ENDED:
            console.log("Player left! GAME OVER:", payload);
            setGameStarted(false);
            setGameEnded(true)
            setplayerWon(payload.result===color?username:Opponent?.name)
            chess.reset();
            break;
          case GAME_OVER:
            console.log("Player left! GAME OVER:", payload);
            setGameStarted(false);
            chess.reset();
            break;
        }
      };
    }
  }, [socket, chess]);

  function renderComponent() {
    switch (activeTab) {
      case "newgame":
        return (
          socket && <NewGame setActiveTab={setActiveTab} socket={socket} />
        );
      case "history":
        return <History />;
      case "friends":
        return <Friends />;
      case "play":
        return <Play moves={moves} socket={socket} />;
      default:
        return null;
    }
  }

  function handleSetting() {
    setSetting(!setting);
    document.getElementById("setting")?.classList.toggle("rotate-[45deg]");
  }

  async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  if (!socket) return <div>Connecting...</div>;

  return (
    <>
      {console.log()}

      <div className="absolute flex flex-col lg:flex-row md:h-full md:w-full -z-12 ">
        <div className=" flex flex-col lg:flex-row justify-between bg-gradient-to-r  from-zinc-200 to-zinc-100 backdrop-blur-md h-fit w-full lg:w-[60%] md:h-full p-5 -z-10  ">
          <div className="flex flex-row lg:flex-col justify-between">
            <img
              className="h-10 lg:h-13 lg:w-8 xl:h-20 xl:w-13 w-6 ml-1 drop-shadow-lg/40 cursor-pointer "
              onClick={() => navigate("/")}
              src="/media/Broot.png"
              alt="Broot"
            />
            <img
              id="setting"
              className="h-5 w-5 p-1  md:h-10 md:w-10 transition duration-400 cursor-pointer "
              onClick={handleSetting}
              src="/media/setting.png"
              alt=""
            />
          </div>

          <div className="flex items-center mx-auto flex-col w-full lg:w-[70%] lg:h-full max-w-[630px] lg:self-end h-full ">

            <div className={`absolute w-[82%] aspect-square z-50 rounded-lg p-1 justify-center items-center backdrop-blur-[2px] ${gameEnded?"flex":"hidden"}`}>
              <div className={`w-50 h-55 z-50 flex bg-zinc-800 rounded-lg p-1 flex-col `}>
                <div className="text-lg text-zinc-200 font-bold mt-5 text-center">
                  {playerWon}  WON
                </div>
                <div className="flex flex-row justify-center items-center">
                  <div className="flex flex-col">
                    <img
                      className="size-18"
                      src={Opponent?.profile || "../../public/media/userW.png"}
                      alt=""
                    />
                    <div className="text-[10px] text-center text-zinc-300 font-bold">
                      {Opponent?.name || "Opponent"}
                    </div>
                  </div>
                  <div className="text-lg text-zinc-200 font-bold mt-2">VS</div>
                  <div className="flex flex-col">
                    <img
                      className="size-18"
                      src={profile || "../../public/media/userW.png"}
                      alt=""
                    />
                    <div className="text-[10px] text-center text-zinc-300 font-bold">
                      {username}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PlayerInfo
              userName={Opponent?.name || "Opponent"}
              rating={Opponent?.rating || 500}
              color={color}
              profile={Opponent?.profile || "../../public/media/userW.png"}
            />
            <ChessBoard
              board={board}
              setBoard={setBoard}
              chess={chess}
              socket={socket}
              color={color}
              roomId={roomId}
            />
            <PlayerInfo
              userName={username}
              rating={rating}
              color={color}
              profile={profile || "../../public/media/userW.png"}
            />
          </div>
        </div>

        <div className=" flex flex-col bg-zinc-800 backdrop-blur-md h-[600px] md:h-full lg:w-[40%] p-5 -z-10">
          <div className="flex w-full h-fit">
            <div
              onClick={() => setActiveTab("play")}
              className={`${
                gameStarted ? "flex" : "hidden"
              } text-zinc-200 font-[500] flex-col flex-1 text-center rounded-t-2xl cursor-pointer h-fit p-2 ${
                activeTab === "play" ? "bg-zinc-700" : "bg-zinc-900"
              }`}
            >
              <img
                className="size-6 self-center"
                src="../../public/media/playW.png"
                alt=""
              />
              Play
            </div>
            <div
              onClick={() => setActiveTab("newgame")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center rounded-t-2xl cursor-pointer h-fit p-2 ${
                activeTab === "newgame" ? "bg-zinc-700" : "bg-zinc-900"
              }`}
            >
              <img
                className="size-6 self-center"
                src="../../public/media/newgame.png"
                alt=""
              />
              New Game
            </div>
            <div
              onClick={() => setActiveTab("history")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center rounded-t-2xl cursor-pointer h-fit p-2 ${
                activeTab === "history" ? "bg-zinc-700" : "bg-zinc-900"
              }`}
            >
              <img
                className="size-6 self-center"
                src="../../public/media/game.png"
                alt=""
              />
              Games
            </div>
            <div
              onClick={() => setActiveTab("friends")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center rounded-t-2xl cursor-pointer h-fit p-2 ${
                activeTab === "friends" ? "bg-zinc-700" : "bg-zinc-900"
              }`}
            >
              <img
                className="size-6 self-center"
                src="../../public/media/socialW.png"
                alt=""
              />
              Friends
            </div>
          </div>
          {renderComponent()}
        </div>
      </div>
      <div
        className={`absolute -left-2 bottom-8 m-8 w-50 bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-[0_5px_5px_rgba(0,0,0,0.25)] rounded-lg z-10 flex-col duration-300 lg:flex hidden overflow-hidden ${
          setting ? "h-fit opacity-100 " : "h-0 opacity-0"
        }`}
      >
        <div className="nav flex flex-row m-1 mb-0 items-center h-10 w-[90%] rounded-lg font-[500] text-md text-zinc-800 cursor-pointer">
          <img
            className="size-6 m-2"
            src="../../public/media/theme.png"
            alt=""
          />
          Theme
        </div>
        <div
          onClick={handleLogout}
          className="nav flex flex-row m-1 mt-0 items-center h-10 w-[90%] rounded-lg font-[500] text-md text-zinc-800 cursor-pointer"
        >
          <img
            className="h-6 w-6 m-2"
            src="../../public/media/logout.png"
            alt=""
          />
          LogOut
        </div>
      </div>
    </>
  );
};

export default Trasition(ChessGame);
