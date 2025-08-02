import { useState } from "react";
import { ChessBoard } from "../components/board";
import { PlayerInfo } from "../components/playerInfos";
import { Trasition } from "../transition";
import axios from "axios";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";
import { NewGame } from "../components/newGamebox";
import { History } from "../components/historyBox";
import { Friends } from "../components/friendsBox";
import { Play } from "../components/playBox";
import { AnimatePresence, motion } from "motion/react";
import { UNDO_MOVE_APPROVE } from "../context/ContextProvider";

export const StartFen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'


const ChessGame = () => {

  const navigate = useNavigate();
  const {user,setUser,socket}=useUserContext()
  const {
    roomId,
    gameStarted,
    Opponent,
    setOpponent,
    activeTab,
    setActiveTab,
    color,
    chess,
    setBoard,
    moves,
    playerWon,
    gameStatus,
    gameEnded,
    setGameEnded,
    gameAlert,
    setGameAlert,
    undoRequested,
    setUndoRequested

  } = useChessContext();
  const { username, rating, profile } = user!;


  const [time, setTime] = useState(5);
  console.log(time,setTime(0));
  
  const [setting, setSetting] = useState(false);

  // useEffect(() => {
  //   if (gameEnded) {
  //     const handleClick = () => {
  //       setGameEnded(false);
  //     };

  //     document.addEventListener("click", handleClick);

  //     return () => {
  //       document.removeEventListener("click", handleClick);
  //     };
  //   }
  // }, []);

  function handleClose()
  {
    setUndoRequested(false)
  }

  function renderComponent() {
    switch (activeTab) {
      case "newgame":
        return (
          socket && <NewGame setGameAlert={setGameAlert} gameAlert={gameAlert} setActiveTab={setActiveTab} socket={socket} />
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

  function handleUndoReq(choice:boolean)
  {
    console.log("roomId",roomId);

     socket?.send(
      JSON.stringify({
        type: UNDO_MOVE_APPROVE,
        payload: {
          gameId:roomId,
          color: color=="white"?"w":"b",
          choice:choice
        },
      })
    );

  }

  async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  if (!socket) return <div>
    socket : {socket} {" "}
    Connecting...</div>;

  return (
    <>
      {
      }

      <div className="absolute flex flex-col lg:flex-row md:h-full md:w-full -z-12 ">
        <div className=" flex flex-col lg:flex-row justify-between bg-gradient-to-r  from-zinc-200 to-zinc-100 backdrop-blur-md h-fit w-full lg:w-[60%] md:h-full p-5 -z-10  ">
          <div className="flex flex-row lg:flex-col justify-between">
            <img
              className="h-10 lg:h-13 lg:w-8 xl:h-20 xl:w-12 w-6 ml-2 drop-shadow-lg/40 cursor-pointer "
              onClick={() => navigate("/")}
              src="/media/Broot.png"
              alt="Broot"
            />
            <div className="flex flex-row lg:flex-col ml-1">
              <div className="nav size-fit p-2 rounded-full cursor-pointer duration-200">
                <img className="img size-8" src="./media/profile.png" alt="" />
              </div>
              <div 
              onClick={()=>navigate("/home")}
              className="nav size-fit p-2 rounded-full cursor-pointer duration-200">
                <img className="img size-8" src="./media/home.png" alt="" />
              </div>
              <div 
              onClick={()=>navigate("/social")}
              className="nav size-fit p-2 rounded-full cursor-pointer duration-200">
                <img className="img size-8" src="./media/social.png" alt="" />
              </div>
            </div>
            <img
              id="setting"
              className="h-5 w-5 p-1 ml-1 md:h-10 md:w-10 transition duration-400 cursor-pointer "
              onClick={handleSetting}
              src="/media/setting.png"
              alt=""
            />
          </div>

          <div className="flex items-center mx-auto flex-col w-full lg:w-[70%] lg:h-full max-w-[630px] lg:self-end h-full ">
           <AnimatePresence>
            {
             gameEnded &&
             <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.2 }}
              className={`absolute w-[82%] aspect-square z-50 rounded-lg p-1 justify-center items-center backdrop-blur-[2px] flex`}
            >
              <div
                className={`w-55 h-60 z-50 flex bg-zinc-800 rounded-lg p-1 flex-col`}
              >
                <div className="text-2xl text-zinc-200 font-bold mt-5 text-center">
                  {playerWon} Won
                  <div className="text-[12px] text-zinc-400 font-bold text-center">
                    by {gameStatus}
                  </div>
                </div>
              <img 
              onClick={handleClose}
              className="absolute size-7 flex z-50 self-end rotate-45 invert cursor-pointer hover:drop-shadow-[0px_0px_2px] hover:drop-shadow-zinc-500" src="./media/closeOption.png" alt="" />
                <div className="flex flex-row justify-center items-center mt-3">
                  <div className="flex flex-col">
                    <img
                      className={`absolute size-7 drop-shadow-sm/90 -rotate-25 heartbeat ${
                        playerWon === username ? "hidden" : ""
                      }`}
                      src="./media/won.png"
                      alt=""
                    />
                    <img
                      className="size-18"
                      src={Opponent?.profile || "/media/userW.png"}
                      alt=""
                    />
                    <div className="text-[10px] text-center text-zinc-300 font-bold">
                      {Opponent?.name || "Opponent"}
                    </div>
                  </div>
                  <div className="text-lg text-zinc-200 font-bold mt-2">VS</div>
                  <div className="flex flex-col">
                    <img
                      className={`absolute size-7 drop-shadow-sm/90 -rotate-25 heartbeat ${
                        playerWon === username ? "" : "hidden"
                      }`}
                      src="./media/won.png"
                      alt=""
                    />
                    <img
                      className="size-18"
                      src={profile || "/media/userW.png"}
                      alt=""
                    />
                    <div className="text-[10px] text-center text-zinc-300 font-bold">
                      {username}
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveTab("newgame");
                    setOpponent(null)
                    setGameEnded(false);
                    const newBoard=chess.board()
                    setBoard(newBoard);

                  }}
                  className="text-lg text-zinc-200 font-bold m-3 rounded-md text-center bg-emerald-900 w-[80%] flex mx-auto justify-center p-2 cursor-pointer playButton"
                >
                  New Game
                </div>
              </div>
            </motion.div>}
           </AnimatePresence>
                         {/* ///////////////// take back one move logic ////////////////////// */}
           <AnimatePresence>
            {
             undoRequested &&
             <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.2 }}
              className={`absolute w-[82%] aspect-square z-50 rounded-lg p-1 justify-center items-center flex`}
            >
              <div
                className={`w-60 h-40 z-50 flex bg-zinc-800 rounded-lg p-1 flex-col `}
              >
                <div className="text-2xl text-zinc-200 font-bold mt-5 text-center flex flex-col justify-center items-center">
                  Undo Request
                  <div className="text-[12px] text-zinc-400 font-bold w-[60%] text-center mt-1">
                  Broot wants to revert their move
                  </div>
                </div>
              
              <img 
              onClick={handleClose}
              className="absolute size-7 flex z-50 self-end rotate-45 invert cursor-pointer hover:drop-shadow-[0px_0px_2px] hover:drop-shadow-zinc-500" 
              src="./media/closeOption.png" 
              alt="" 
              />
                
              <div className=" w-[80%] flex mx-auto justify-center  ">
                <div 
                onClick={()=>handleUndoReq(true)}
                className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-emerald-900 playButton cursor-pointer flex-1">Accept</div>
                <div 
                onClick={()=>handleUndoReq(false)}
                className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-zinc-700 cursor-pointer flex-1">Reject</div>
              </div>
              </div>
            </motion.div>}
           </AnimatePresence>

            <PlayerInfo
              userName={Opponent?.username || "Opponent"}
              rating={Opponent?.rating || 500}
              color={color}
              profile={Opponent?.profile || "/media/userW.png"}
            />
            <ChessBoard/>
            <PlayerInfo
              userName={username}
              rating={rating}
              color={color}
              profile={profile || "/media/userW.png"}
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
                src="/media/playW.png"
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
                src="/media/newgame.png"
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
                src="/media/game.png"
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
                src="/media/socialW.png"
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
            src="/media/theme.png"
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
            src="/media/logout.png"
            alt=""
          />
          LogOut
        </div>
      </div>
    </>
  );
};

export default Trasition(ChessGame);
