import { Chess, Color, PieceSymbol, Square, SQUARES } from "chess.js";
import { useState } from "react";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
  color,
  roomId
}: {
  color: string;
  chess: Chess;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  roomId:string|undefined;
}) => {
    const MOVE = "move";
    

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

                return (
                  <div
                    key={j}
                    id={squareId}
                    onDrop={() => handleDrop(squareId)}
                    onDragOver={allowDrop}
                    onClick={() => handleSquareClick(squareId)}
                    className={`flex-1 aspect-square hover:cursor-pointer ${
                      (i + j) % 2 == 0
                        ? "bg-zinc-200 hover:bg-white "
                        : "bg-zinc-600 hover:bg-zinc-400 "
                    }${from?validmoves.includes(squareId)?"validHighlight":"":""}
                    ${square?.type==="k"&&square?.color===chess.turn()&&inCheck?"alert":""}`}

                  >
                    <div className="absolute text-[5px] text-zinc-800 font-[900] ml-[2px]">
                      {squareId}
                    </div>
                     {square ? (
                        <div
                          className={`${
                            from === squareId ? "bg-blue-200": ""
                          }`}
                          draggable={true}
                          onDragStart={() => handleDragstart(squareId)}
                        >
                          <img
                            className={`${
                              square.color == "b"
                                ? "drop-shadow-lg/40"
                                : "drop-shadow-md/80 z-5"
                            }`}
                            src={`../public/media/${
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
