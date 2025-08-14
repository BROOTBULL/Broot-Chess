import { Square, SQUARES } from "chess.js";
import { useState } from "react";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import { boardTheme } from "../assets/boardtheme";

export const ChessBoard = ({ showSquare }: { showSquare: boolean }) => {
  const MOVE = "move";
  const { socket } = useUserContext();
  const { setBoard, board, chess, color, roomId, moves, boardAppearnce } =
    useChessContext();

  const rows = color === "w" ? board : [...board].reverse();
  const [validmoves, setValidmoves] = useState<Square[]>([]);
  const [from, setFrom] = useState<null | Square>(null);

  function setMove(clickedSquare: Square) {
    const rawMoves = chess.moves({
      square: clickedSquare,
      verbose: true,
    }) as { to: Square }[];

    const validMoves: Square[] = rawMoves.map((move) => move.to as Square);
    setValidmoves(validMoves);
  }

  function sendMove(from: Square, to: Square) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            gameId: roomId,
            move: { from, to },
          },
        })
      );
    } else {
      console.warn("WebSocket is not open.");
    }

    chess.move({ from, to });
    setBoard(chess.board());
  }

  function handleSquareClick(clickedSquare: Square) {
    setMove(clickedSquare); // highlight

    if (!from) {
      setFrom(clickedSquare);
    } else {
      sendMove(from, clickedSquare);
      setFrom(null);
    }
  }

  function handleDragStart(draggedFrom: Square) {
    setFrom(draggedFrom);
    setMove(draggedFrom);
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(draggedTo: Square) {
    if (from) {
      sendMove(from, draggedTo);
      setFrom(null);
    }
  }

  return (
    <div className="flex flex-col place-content-center w-[98%] h-fit aspect-square ring-1 shadow-[5px_5px_15px_black] rounded-md overflow-hidden">
      {rows.map((row, i) => {
        const cols = color === "w" ? row : [...row].reverse();

        return (
          <div key={i} className="flex">
            {cols.map((square, j) => {
              const squareIndex =
                color === "w" ? i * 8 + j : 63 - (i * 8 + j);
              const squareId = SQUARES[squareIndex];
              const inCheck = chess.inCheck();

              const theme = boardTheme.find(
                (t) => t.theme === boardAppearnce
              );
              const lastMove = moves.length && moves[moves.length - 1].to;

              return (
                <div
                  key={j}
                  id={squareId}
                  onDrop={() => handleDrop(squareId)}
                  onDragOver={allowDrop}
                  onClick={() => handleSquareClick(squareId)}
                  className={`flex-1 aspect-square hover:cursor-pointer ${
                    (i + j) % 2 == 0
                      ? `${theme?.lightTile.square} ${theme?.lightTile.hover}`
                      : `${theme?.darkTile.square} ${theme?.darkTile.hover}`
                  }${
                    from && validmoves.includes(squareId)
                      ? " validHighlight "
                      : ""
                  }${
                    square?.type === "k" &&
                    square?.color === chess.turn() &&
                    inCheck
                      ? " alert"
                      : ""
                  }`}
                >
                  {showSquare && (
                    <div className="absolute text-[6px] md:text-[7px] text-zinc-800 font-[900] ml-[2px] pointer-events-none">
                      {squareId}
                    </div>
                  )}
                  {square ? (
                    <div
                      className={`${
                        from === squareId
                          ? " bg-blue-200 inset-ring-3 inset-ring-blue-500"
                          : ""
                      } ${
                        lastMove === squareId
                          ? "bg-radial from-green-200 to-green-400"
                          : ""
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(squareId)}
                    >
                      <img
                        className={`${
                          square.color == "b"
                            ? "drop-shadow-lg/40"
                            : "drop-shadow-md/80 z-5"
                        }`}
                        src={`/media/pieces/${square.type + square.color}.png`}
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
  );
};
