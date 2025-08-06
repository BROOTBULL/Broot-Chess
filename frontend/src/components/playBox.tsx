import { useState } from "react";
import { useChessContext } from "../hooks/contextHook";
import { MessageBox } from "./messagebox";
import { SearchingLoader } from "../assets/loader";

const EXIT_GAME = "exit_game";
const UNDO_MOVE = "undo_move";

export const Play = ({
  socket
}: {
  socket: WebSocket | null;
}) => {
  const {
    connecting,
    roomId,
    undoBox,
    setUndoBox,
    waitingResponse,
    setWaitingResponse,
    moves
  } = useChessContext();
  const [resignBox, setResignBox] = useState<boolean>(false);

  if (connecting)
    return (
      <SearchingLoader/>
    );

  function handleResign() {
    setResignBox(!resignBox);
  }

  function handleExitGame() {
    socket?.send(
      JSON.stringify({
        type: EXIT_GAME,
        payload: {
          gameId: roomId,
        },
      })
    );
    setResignBox(false);
  }

  function handleUndoReq() {
    setWaitingResponse(true);
    console.log(roomId);
    if (roomId)
      socket?.send(
        JSON.stringify({
          type: UNDO_MOVE,
          payload: {
            gameId: roomId,
          },
        })
      );
  }

  return (
    <>
      {console.log()}

      <div className="p-3 h-full bg-zinc-700">
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
              return (
                <div key={i}>
                  <div className="flex flex-row items-center text-sm font-[500] text-center m-1">
                    <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                      {moves[i]}
                    </div>
                    <div className="flex items-center justify-center h-7  text-zinc-200 flex-5">
                      {moves[++i]}
                    </div>
                    <div className="flex flex-col items-center justify-center h-7 text-zinc-200 flex-2">
                      <div className="text-[10px] bg-zinc-700 w-[80%]">
                        00:02
                      </div>
                      <div className="text-[10px] bg-black w-[80%]">
                        {moves[i] ? "00:03" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="border-b-1 border-zinc-800 w-[95%] flex mx-auto" />
                </div>
              );
            })}
          </div>

          <div className="flex flex-row items-center bg-zinc-800 h-11 font-[500] text-center mt-auto">
            <div
              className={`${
                undoBox ? " max-h-25 " : " max-h-0 "
              }bg-zinc-700 h-25 w-50 absolute mb-36 m-1 rounded-md flex flex-col justify-center items-center overflow-hidden duration-200`}
            >
              {waitingResponse ? (
                <div className="flex flex-row justify-center m-1 w-[80%]">
                  <div className="text-zinc-200">
                    Waiting for Opponent Response...
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-zinc-300 mt-1">
                    Request to revert your last move?
                  </div>
                  <div className="flex flex-row justify-center gap-3 m-1 w-[80%]">
                    <div
                      onClick={() => handleUndoReq()}
                      className="bg-teal-950 text-zinc-200 p-1 px-2 cursor-pointer duration-200 hover:bg-teal-900 rounded-md flex-1"
                    >
                      Yes
                    </div>
                    <div
                      onClick={() => setUndoBox(!undoBox)}
                      className="bg-rose-950/50 p-1 text-zinc-200 px-2 cursor-pointer rounded-md hover:bg-rose-900 duration-200 shadow-md flex-1"
                    >
                      No
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (moves.length === 0) return;
                setUndoBox(!undoBox);
              }}
              className="flex items-center justify-center h-8 text-sm hover:bg-blue-900/70 duration-200 bg-blue-950/30 m-1 px-2 rounded-sm text-zinc-200 w-fit cursor-pointer border-2 border-blue-900"
            >
              <img className="size-5 mr-2" src="./media/takeback.png" alt="" />{" "}
              RequestUndo
            </button>
            <button
              onClick={() => handleResign()}
              className="flex items-center justify-center h-8 hover:bg-rose-600/40 bg-rose-500/10 duration-200 m-1 px-2 rounded-sm text-sm text-zinc-200 w-fit cursor-pointer  border-2 border-rose-900/70"
            >
              <img className="size-4 mr-2" src="./media/flag.png" alt="" />{" "}
              Resign
            </button>
            <div
              id="resignBox"
              className={`absolute w-30 bg-red z-15 ml-32 mt-28 bg-zinc-700 rounded-lg flex flex-col gap-2 ${
                resignBox ? " h-18 opacity-100" : " h-14 opacity-0"
              } duration-150 overflow-hidden `}
            >
              <div className="text-zinc-300 mt-1">Are you sure ?</div>
              <div className="flex flex-row justify-center gap-3 mb-2 ">
                <div
                  onClick={() => handleExitGame()}
                  className="bg-teal-950 p-1 px-2 cursor-pointer duration-200 hover:bg-teal-800 rounded-md "
                >
                  <img className="size-5" src="./media/yes.png" alt="" />
                </div>
                <div
                  onClick={() => setResignBox(false)}
                  className="bg-rose-950/50 p-1 px-2 cursor-pointer rounded-md hover:bg-rose-800 duration-200 shadow-md"
                >
                  <img
                    className="size-5 rotate-45"
                    src="./media/plus.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <button
            className="flex items-center justify-center h-8 text-sm hover:bg-zinc-600 duration-200 bg-zinc-700 m-1 px-2 rounded-sm text-zinc-200 w-fit cursor-pointer  border-2 border-zinc-600">
              <img className="size-5 mr-2" src="./media/draw.png" alt="" /> Draw
            </button>
          </div>
          <MessageBox />
        </div>
      </div>
    </>
  );
};
