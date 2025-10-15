import { Chess, Square, SQUARES } from "chess.js";
import { useEffect, useState } from "react";
import { useChessContext, useUserContext } from "../../hooks/contextHook";
import { boardTheme } from "../../assets/boardtheme";
import { useGetBestMove } from "../../hooks/getBestMove";

export const ChessBoard = ({ showSquare }: { showSquare: boolean }) => {
  const MOVE = "move";
  const { socket, isPlayingBot,user } = useUserContext();
  const { getBestMove } = useGetBestMove();
  const {
    board,
    chess,
    color,
    roomId,
    moves,
    boardAppearnce,
    setBoard,
    GameStarted,
    MultiplayerGameStarted,
    showHint,
    setShowHint,
    setGameEnded,
    setGameStarted,
    setPlayerWon,
    setGameStatus,
  } = useChessContext();

  type BestMove = {
    from: string;
    to: string;
    p: string;
  };
  const rows = color === "w" ? board : [...board].reverse();
  const [validmoves, setValidmoves] = useState<Square[]>([]);
  const [from, setFrom] = useState<null | Square>(null);
  const [bestMove, setBestMove] = useState<BestMove | null>();

  useEffect(() => {
    const fetchAndPlayBotMove = async () => {
      if (!chess || !GameStarted) return;

      const fen = chess.fen();
      const move = (await getBestMove(fen)) as BestMove;

      if (!move) return;
      console.log("Best move :", move);

      setBestMove(move);
      if (chess.turn() !== color && isPlayingBot && !MultiplayerGameStarted) {
        if (isPromoting(chess, move.from as Square, move.to as Square)) {
          chess.move({ from: move.from, to: move.to, promotion: "q" });
        } else {
          chess.move({ from: move.from, to: move.to });
        }

        setBoard(chess.board());
        if (chess.isCheckmate()) {
          setGameStatus("Checkmate");
          setPlayerWon("Opponent");
          gameEnded()
        } else if (chess.isDraw()) {
          setPlayerWon("Draw");
          setGameStatus("Draw");
          gameEnded()
        }
      }
    };

    fetchAndPlayBotMove();
  }, [board, isPlayingBot]);

  function gameEnded() {
    setGameStarted(false);
    setGameEnded(true);
    chess.reset();
  }

  function setMove(clickedSquare: Square) {
    const rawMoves = chess.moves({
      square: clickedSquare,
      verbose: true,
    }) as { to: Square }[];

    const validMoves: Square[] = rawMoves.map((move) => move.to as Square);
    setValidmoves(validMoves);
  }

  function isPromoting(chess: Chess, from: Square, to: Square) {
    const piece = chess.get(from);

    if (!piece || piece.type !== "p") return false;

    // White pawn reaching 8th rank or black pawn reaching 1st
    return (
      (piece.color === "w" && to.endsWith("8")) ||
      (piece.color === "b" && to.endsWith("1"))
    );
  }

  async function sendMove(from: Square, to: Square) {
    try {
      if (isPromoting(chess, from as Square, to as Square)) {
        chess.move({
          from,
          to,
          promotion: "q",
        });
      } else {
        const abc = chess.move({ from, to });
        console.log(abc);
      }
    } catch (error) {
      console.log("Error", error);
    }
    setBoard(chess.board());
    setShowHint(false);
    //Bot Logic
    if (isPlayingBot) {
      if (chess.isCheckmate()) {
        setGameStatus("Checkmate");
        setPlayerWon(user?.name)
        gameEnded()
      } else if (chess.isDraw()) {
        setGameStatus("Draw");
        setPlayerWon("Draw")
        gameEnded()
      }
    }

    // Multiplayer Logic
    else {
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
    }
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
              const squareIndex = color === "w" ? i * 8 + j : 63 - (i * 8 + j);
              const squareId = SQUARES[squareIndex];
              const inCheck = chess.inCheck();

              const theme = boardTheme.find((t) => t.theme === boardAppearnce);
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
                  } ${
                    bestMove?.to === squareId && showHint ? " bestMoveTo " : ""
                  }
                      ${
                        bestMove?.from === squareId && showHint
                          ? " bestMoveFrom "
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
