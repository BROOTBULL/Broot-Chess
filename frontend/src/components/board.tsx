import { Square, SQUARES } from "chess.js";
import { useState } from "react";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import { boardTheme } from "../assets/boardtheme";

export const ChessBoard = ({showSquare}:{showSquare:boolean}) => {
    const MOVE = "move";
    const {socket}=useUserContext()
    const {setBoard,board,chess,color,roomId,moves,boardAppearnce}=useChessContext()

    const rows = color === "white" ? board : [...board].reverse();
    const [validmoves, setValidmoves] = useState<Square[]>([]);
    const [from, setFrom] = useState<null | Square>(null);


function setMove(clickedSquare: Square) {
const rawMoves = chess.moves({ square: clickedSquare, verbose: true }) as { to: Square }[];

const validMoves: Square[] = rawMoves.map((move) => move.to as Square);

setValidmoves(validMoves);

}

function handleSquareClick(clickedSquare: Square) {
  setMove(clickedSquare); // To update highlights etc.

  if (!from) {
    setFrom(clickedSquare);
  } else {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload:{
          gameId:roomId,
          move: {
            from,
            to: clickedSquare,
          },
          }
        })
      );
    } else {
      console.warn("WebSocket is not open.");
    }

    setFrom(null); 
  }
}


  function handleDragstart(draggedfrom: Square) {
    console.log("::", draggedfrom);
    if (!from) {
      setFrom(draggedfrom);
    }
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault(); // Allow drop
  }

  function handleDrop(draggedTo: Square) {
    console.log(":", draggedTo);
    if (from) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: MOVE,
            move: {
              from,
              to: draggedTo,
            },
          })
        );
      } else {
        console.warn("WebSocket is not open.");
      }
      if (from) setFrom(null);
      chess.move({ from, to: draggedTo });
      setBoard(chess.board());
      
    }
}

  return (
    <>
    
      <div className="flex flex-col place-content-center w-[98%] h-fit aspect-square ring-1 shadow-[5px_5px_20px_black] ">
        
        {rows.map((row, i) => {
          const cols = color === "white" ? row : [...row].reverse();

          return (
            <div
            key={i}
            className="flex">

              {cols.map((square, j) => {
                const squareIndex =
                  color === "white" ? i * 8 + j : 63 - (i * 8 + j);
                const squareId = SQUARES[squareIndex];
                const inCheck=chess.inCheck();

                const theme=boardTheme.find((t)=>t.theme===boardAppearnce)

                return (
                  <div
                    key={j}
                    id={squareId}
                    onDrop={() => handleDrop(squareId)}
                    onDragOver={allowDrop}
                    onClick={() => handleSquareClick(squareId)}
                    className={`flex-1 aspect-square hover:cursor-pointer ${
                      (i + j) % 2 == 0
                        ? ` ${ theme?.lightTile.square} hover:${theme?.lightTile.hover }`
                        : ` ${ theme?.darkTile.square} hover:${theme?.darkTile.hover }`

                    }${from?validmoves.includes(squareId)?" validHighlight ":"":""}
                    ${square?.type==="k"&&square?.color===chess.turn()&&inCheck?"alert":""}`}

                  >
                    {showSquare&&<div className="absolute text-[6px] md:text-[7px] text-zinc-800 font-[900] ml-[2px] pointer-events-none">
                      {squareId}
                    </div>}
                     {square ? (
                        <div
                          className={`${
                            from === squareId ? " bg-blue-200 inset-ring-3 inset-ring-blue-500": ""
                          } ${moves[moves.length-1]===squareId?"bg-radial from-green-200 to-green-400":""}`}
                          draggable={true}
                          onDragStart={() => handleDragstart(squareId)}
                        >
                          <img
                            className={`${
                              square.color == "b"
                                ? "drop-shadow-lg/40"
                                : "drop-shadow-md/80 z-5"
                            }`}
                            src={`/media/${
                              square.type + square.color
                            }.png `}
                          />
                        </div>
                      ) : (
                        " "
                      )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
