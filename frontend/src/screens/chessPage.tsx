import { useState } from "react";
import { ChessBoard } from "../components/gamePage-components/board";
import { PlayerInfo } from "../components/gamePage-components/playerInfos";
import { Trasition } from "../transition";
import axios from "axios";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";
import { NewGame } from "../components/gamePage-components/newGamebox";
import { History } from "../components/gamePage-components/historyBox";
import { Friends } from "../components/gamePage-components/friendsBox";
import { Play } from "../components/gamePage-components/playBox";
import { AnimatePresence, motion } from "motion/react";
import { UNDO_MOVE_APPROVE } from "../context/ContextProvider";
import { BoardAppreance } from "../components/gamePage-components/boardAppreance";
import { LandingLoader } from "../assets/loader";
import { DrawRequest } from "../components/gamePage-components/drawReq";
import { Rating } from "../context/userProvider";

export const StartFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const ChessGame = () => {
  const navigate = useNavigate();
  const { user, setUser, socket, Ratings } = useUserContext();
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
    playerWon,
    gameStatus,
    gameEnded,
    setGameEnded,
    gameAlert,
    setGameAlert,
    undoRequested,
    setUndoRequested,
  } = useChessContext();
  const { name, profile } = user!;


  const [setting, setSetting] = useState(false);
  const [showSquare, setShowSquare] = useState(false);
  const [theme, setTheme] = useState(false);
  const isMyTurn = color === chess.turn();

  function handleClose() {
    setGameEnded(false);
    setUndoRequested(false);
    setTheme(false);
  }

  function renderComponent() {
    switch (activeTab) {
      case "newgame":
        return (
          socket && (
            <NewGame
              setGameAlert={setGameAlert}
              gameAlert={gameAlert}
              setActiveTab={setActiveTab}
              socket={socket}
            />
          )
        );
      case "history":
        return <History />;
      case "friends":
        return <Friends />;
      case "play":
        return <Play />;
      default:
        return null;
    }
  }

  function handleSetting() {
    setSetting(!setting);
    document.getElementById("setting")?.classList.toggle("rotate-[45deg]");
  }

  function handleUndoReq(choice: boolean) {
    console.log("roomId", roomId);
    socket?.send(
      JSON.stringify({
        type: UNDO_MOVE_APPROVE,
        payload: {
          gameId: roomId,
          color: color,
          choice: choice,
        },
      })
    );
  }

  async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  if (!socket) return <LandingLoader />;

  return (
    <>

      <div className="absolute flex flex-col xl:flex-row md:h-full w-full  ">
        <div className=" flex flex-col lg:flex-row justify-between bg-gradient-to-r  from-zinc-300 to-zinc-400 backdrop-blur-md h-fit w-full xl:w-[60%] md:h-full p-5 ">
          <div className="flex flex-row lg:flex-col justify-between items-center mb-5">
            <img
              className="h-10 lg:h-13 lg:w-8 xl:h-16 xl:w-9 w-6 ml-2 drop-shadow-lg/40 cursor-pointer "
              onClick={() => navigate("/")}
              src="/media/Broot.png"
              alt="Broot"
            />
            <div className="flex flex-row lg:flex-col ml-1">
              <div
                onClick={() => navigate(`/profile/${user?.id}`)}
                className="nav size-fit p-1 rounded-full cursor-pointer duration-200"
              >
                <img className="img size-8" src="./media/profile.png" alt="" />
              </div>
              <div
                onClick={() => navigate("/home")}
                className="nav size-fit p-1 rounded-full cursor-pointer duration-200"
              >
                <img className="img size-8" src="./media/home.png" alt="" />
              </div>
              <div
                onClick={() => navigate("/social")}
                className="nav size-fit p-1 rounded-full cursor-pointer duration-200"
              >
                <img className="img size-8" src="./media/social.png" alt="" />
              </div>
            </div>
            <img
              id="setting"
              className="size-8 md:size-10 p-1 ml-1 transition duration-400 cursor-pointer "
              onClick={handleSetting}
              src="/media/setting.png"
              alt=""
            />
            <div
              className={`absolute right-0 mt-40 mx-2 w-35 bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-[0_5px_5px_rgba(0,0,0,0.25)] rounded-lg z-10 flex-col duration-300 flex lg:hidden overflow-hidden h-fit ${
                setting ? "max-h-100 opacity-100 " : "max-h-0 opacity-0"
              }`}
            >
              <button
                onClick={() => {
                  setTheme(!theme);
                  setSetting(false);
                }}
                className="nav flex flex-row m-1 mb-0 items-center h-8 w-[90%] rounded-lg font-[500] text-sm text-zinc-800 cursor-pointer"
              >
                <img
                  className=" img size-4 m-2"
                  src="/media/theme.png"
                  alt=""
                />
                Appearance
              </button>
              <button
                onClick={() => setShowSquare(!showSquare)}
                className={`${
                  showSquare ? " bg-zinc-950 text-zinc-200 " : "text-zinc-800"
                } flex flex-row m-1 my-0 items-center h-8 w-[90%] rounded-lg font-[500] text-sm  cursor-pointer`}
              >
                <div className="size-4 m-2 mb-3 font-bold">e4</div>
                Show Square
              </button>
              <button
                onClick={handleLogout}
                className="nav flex flex-row m-1 mt-0 items-center h-8 w-[90%] rounded-lg font-[500] text-sm text-zinc-800 cursor-pointer"
              >
                <img
                  className="img size-4 m-2"
                  src="/media/logout.png"
                  alt=""
                />
                LogOut
              </button>
            </div>
          </div>

          <div className="flex items-center mx-auto flex-col w-full lg:w-[70%] lg:h-full max-w-[630px] lg:self-end h-full justify-center">
            <AnimatePresence>
              {gameEnded && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2, delay: 0 },
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                    transition: { duration: 0.2, delay: 0 },
                  }}
                  className={`absolute w-[90%] max-w-[630px] xl:w-[66%] aspect-square z-50 rounded-lg p-1 justify-center items-center backdrop-blur-[2px] flex`}
                >
                  <div
                    className={`w-55 h-60 z-50 flex bg-zinc-800 rounded-lg p-1 flex-col`}
                  >
                    {playerWon === "Draw" ? (
                      <div className="text-2xl text-zinc-200 font-bold mt-5 text-center">
                        Draw
                        <div className="text-[12px] text-zinc-400 font-bold text-center">
                          Match ended in a Draw
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl text-zinc-200 font-bold mt-5 text-center">
                        {playerWon} Won
                        <div className="text-[12px] text-zinc-400 font-bold text-center">
                          by {gameStatus}
                        </div>
                      </div>
                    )}
                    <img
                      onClick={handleClose}
                      className="absolute size-7 flex z-50 self-end rotate-45 invert cursor-pointer hover:drop-shadow-[0px_0px_2px] hover:drop-shadow-zinc-500"
                      src="./media/closeOption.png"
                      alt=""
                    />
                    <div className="flex flex-row justify-center items-center mt-3">
                      <div className="flex flex-col">
                        <img
                          className={`absolute size-7 drop-shadow-sm/90 -rotate-25 heartbeat ${
                            playerWon !== undefined
                              ? playerWon === "Draw"
                                ? ""
                                : playerWon === name
                                ? "hidden"
                                : ""
                              : "hidden"
                          }`}
                          src={
                            playerWon === "Draw"
                              ? `./media/draw.png`
                              : "./media/won.png"
                          }
                          alt=""
                        />
                        <img
                          className="size-18"
                          src={Opponent?.profile || "/media/userW.png"}
                          alt=""
                        />
                        <div className="text-[10px] text-center text-zinc-300 font-bold">
                          {Opponent?.name.slice(0, 8) || "Opponent"}
                        </div>
                      </div>
                      <div className="text-lg text-zinc-200 font-bold mt-2">
                        VS
                      </div>
                      <div className="flex flex-col">
                        <img
                          className={`absolute size-7 drop-shadow-sm/90 -rotate-25 heartbeat ${
                            playerWon !== undefined
                              ? playerWon === "Draw"
                                ? ""
                                : playerWon === name
                                ? ""
                                : "hidden"
                              : "hidden"
                          }`}
                          src={
                            playerWon === "Draw"
                              ? `./media/draw.png`
                              : "./media/won.png"
                          }
                          alt=""
                        />
                        <img
                          className="size-18"
                          src={profile || "/media/userW.png"}
                          alt=""
                        />
                        <div className="text-[10px] text-center text-zinc-300 font-bold">
                          {name}
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setActiveTab("newgame");
                        setOpponent(null);
                        setGameEnded(false);
                        const newBoard = chess.board();
                        setBoard(newBoard);
                      }}
                      className="text-lg text-zinc-200 font-bold m-3 rounded-md text-center bg-emerald-900 w-[80%] flex mx-auto justify-center p-2 cursor-pointer playButton"
                    >
                      New Game
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* ///////////////// take back one move logic ////////////////////// */}
            <AnimatePresence>
              {undoRequested && (
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
                        {Opponent?.name} wants to revert their move
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
                        onClick={() => handleUndoReq(true)}
                        className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-emerald-900 playButton cursor-pointer flex-1"
                      >
                        Accept
                      </div>
                      <div
                        onClick={() => handleUndoReq(false)}
                        className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-zinc-700 cursor-pointer flex-1"
                      >
                        Reject
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ///////////////// Theme changing Window Logic //////////////////////// */}
            <BoardAppreance setTheme={setTheme} theme={theme} />

            {/* ///////////////// Draw Requested Window Logic //////////////////////// */}
            <DrawRequest />

            {/* ///////////////// Reqest Denied Window Logic //////////////////////// */}
            <DrawRequest />

            <PlayerInfo
              name={Opponent?.name || "Opponent"}
              rating={
                Opponent
                  ? (Opponent.rating as Rating)
                  : ({ rapid: 500, blitz: 600, daily: 700 } as Rating)
              }
              playerColor={color === "w" ? "b" : "w"}
              turn={!isMyTurn}
              profile={Opponent?.profile || "/media/userW.png"}
            />
            <ChessBoard showSquare={showSquare} />
            <PlayerInfo
              name={name}
              rating={Ratings as Rating}
              playerColor={color}
              turn={isMyTurn}
              profile={profile || "/media/userW.png"}
            />
          </div>
        </div>

        <div className=" flex flex-col bg-zinc-800 h-fit md:h-full xl:w-[40%] items-center p-2 md:p-5 ">
          <div className="flex w-full h-fit max-w-[1000px]">
            <div
              onClick={() => setActiveTab("play")}
              className={`${
                gameStarted ? "flex" : "hidden"
              } text-zinc-200 font-[500] flex-col flex-1 text-center text-sm rounded-t-xl cursor-pointer h-fit p-2 ${
                activeTab === "play" ? "bg-zinc-700 z-3" :"bg-zinc-900/50"
              }`}
            >
              <img
                className="size-5 self-center"
                src="/media/playW.png"
                alt=""
              />
              Play
            </div>
            <div
              onClick={() => setActiveTab("newgame")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center text-sm rounded-t-xl cursor-pointer h-fit p-2 ${
                activeTab === "newgame" ? "bg-zinc-700 z-3" :"bg-zinc-900/50"
              }`}
            >
              <img
                className="size-5 self-center"
                src="/media/newgame.png"
                alt=""
              />
              NewGame
            </div>
            <div
              onClick={() => setActiveTab("history")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center text-sm rounded-t-xl cursor-pointer h-fit p-2 ${
                activeTab === "history" ? "bg-zinc-700 z-3" :"bg-zinc-900/50"
              }`}
            >
              <img
                className="size-5 self-center"
                src="/media/game.png"
                alt=""
              />
              Games
            </div>
            <div
              onClick={() => setActiveTab("friends")}
              className={` text-zinc-200 font-[500] flex flex-col flex-1 text-center text-sm rounded-t-xl cursor-pointer h-fit p-2 ${
                activeTab === "friends" ? "bg-zinc-700 z-3" :"bg-zinc-900/50"
              }`}
            >
              <img
                className="size-5 self-center"
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
        className={`absolute left-0 bottom-12 m-8 w-50 bg-gradient-to-r h-fit from-zinc-300 to-zinc-100 shadow-[0_5px_5px_rgba(0,0,0,0.25)] rounded-lg z-10 flex-col duration-200 lg:flex hidden overflow-hidden pr-2 ${
          setting ? "max-h-100 opacity-100 " : "max-h-0 opacity-0"
        }`}
      >
        <button
          onClick={() => {
            setTheme(!theme);
            setSetting(false);
          }}
          className="nav flex flex-row m-1 mb-0 items-center h-10 w-full rounded-lg font-[500] text-md text-zinc-800 cursor-pointer"
        >
          <img className="img size-6 m-2" src="/media/theme.png" alt="" />
          Board Appearance
        </button>
        <button
          onClick={() => {
            setShowSquare(!showSquare);
            setSetting(false);
          }}
          className={`nav flex flex-row m-1 my-0 items-center h-10 w-full rounded-lg font-[500] text-md cursor-pointer`}
        >
          <div className="size-6 m-2 font-bold text-md">e4</div>
          Show Square
        </button>
        <button
          onClick={handleLogout}
          className="nav flex flex-row m-1 mt-0 items-center h-10 w-full rounded-lg font-[500] text-md text-zinc-800 cursor-pointer"
        >
          <img className="img size-6 m-2" src="/media/logout.png" alt="" />
          LogOut
        </button>
      </div>
    </>
  );
};

export default Trasition(ChessGame);
