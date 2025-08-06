import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNotification } from "./NotificationProvider";
import { NOTIFICATION } from "../screens/socials";
import { Chess, Move, Piece, Square } from "chess.js";
import { useUserContext } from "../hooks/contextHook";

export interface User {
  id: string; //id for backend processes
  userId: string; //userId for ws processes
  username: string;
  name: string;
  email: string;
  rating: number;
  profile: string;
  token: string;
}

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_ENDED = "game_ended";
export const RECONNECT = "reconnect";
export const GAME_JOINED = "game_joined";
export const CHAT = "chat";
export const GAME_ALERT = "game_alert";
export const GAME_ADDED = "game_added";
export const UNDO_MOVE = "undo_move";
export const UNDO_MOVE_APPROVE = "undo_move_approve";

interface ChessContextType {
  Opponent: User | null;
  setOpponent: React.Dispatch<React.SetStateAction<User | null>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  connecting: boolean;
  setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string | undefined;
  setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  Messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  chess: Chess;
  setChess: React.Dispatch<React.SetStateAction<Chess>>;
  board: (Piece | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>;
   moves: string[];
  setMoves: React.Dispatch<React.SetStateAction<string[]>>;
  playerWon: string | undefined;
  setPlayerWon: React.Dispatch<React.SetStateAction<string | undefined>>;
  gameStatus: string | undefined;
  setGameStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
  gameAlert: string | undefined;
  setGameAlert: React.Dispatch<React.SetStateAction<string | undefined>>;
  gameEnded: boolean;
  setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
  undoRequested: boolean;
  setUndoRequested: React.Dispatch<React.SetStateAction<boolean>>;
  undoBox: boolean;
  setUndoBox: React.Dispatch<React.SetStateAction<boolean>>;
  waitingResponse: boolean;
  setWaitingResponse: React.Dispatch<React.SetStateAction<boolean>>;
  boardAppearnce: string;
  setBoardAppearnce: React.Dispatch<React.SetStateAction<string>>;
}

type GameType = "blitz" | "rapid" | "daily" | "";
type Message = { sender: string; message: string };
type Tab = "newgame" | "history" | "friends" | "play";

export const ChessContext = createContext<ChessContextType | undefined>(
  undefined
);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, socket } = useUserContext();

  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [Opponent, setOpponent] = useState<User | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [gameType, setGameType] = useState<GameType>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [Messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("newgame");
  const [color, setColor] = useState("white");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState<(Piece | null)[][]>(chess.board());
  const [moves, setMoves] = useState<string[]>([]);
  const [playerWon, setPlayerWon] = useState<string | undefined>();
  const [gameStatus, setGameStatus] = useState<string | undefined>();
  const [gameEnded, setGameEnded] = useState(false);
  const [gameAlert, setGameAlert] = useState<string | undefined>();
  const [undoRequested, setUndoRequested] = useState(false);
  const [undoBox, setUndoBox] = useState<boolean>(false);
  const [waitingResponse, setWaitingResponse] = useState<boolean>(false);
  const [boardAppearnce, setBoardAppearnce] = useState<string>( localStorage.getItem("theme")as string||"zinc");


  function isPromoting(chess: Chess, from: Square, to: Square) {
    const piece = chess.get(from);

    if (!piece || piece.type !== "p") return false;

    // White pawn reaching 8th rank or black pawn reaching 1st
    return (
      (piece.color === "w" && to.endsWith("8")) ||
      (piece.color === "b" && to.endsWith("1"))
    );
  }

  const notify = useNotification();

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
              setMessages([])
              setMoves([])
              setActiveTab("play");

              //Room Id in localStorage logic with expiary
              const rmid = payload.RoomId;
              const expiryTime = Date.now() + 15 * 60 * 1000; // 15 minutes in ms
              localStorage.setItem(
                "roomData",
                JSON.stringify({ rmid, expiryTime })
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
              setBoard(chess.board()); //chess.board give a big function that handles how whole board looks it basically used for updating the board ui
            }
            break;
          case GAME_JOINED:
            {
              const isUser = payload.WhitePlayer.id === user?.id;
              setActiveTab("play");
              setConnecting(false);
              setGameStarted(true);
              setOpponent(isUser ? payload.BlackPlayer : payload.WhitePlayer);
              setRoomId(payload.RoomId);
              setMessages(payload.chat);
              chess.load(payload.fen);
              const newBoard = chess.board();
              setBoard(newBoard);
              const moveTo = (payload.moves as Move[]).map((move) => move.to);
              setMoves(moveTo);

              // console.log("Game Rejoined successfully..!!!");
              // console.log("roomId:", payload.RoomId);
              setColor(isUser ? "white" : "black");
            }
            break;
          case GAME_ENDED:
            {
              let wonBy;
              setGameStarted(false);
              setGameEnded(true);
              setPlayerWon(
                payload.result === color ? user?.name : Opponent?.name
              );
              switch (payload.status) {
                case "PLAYER_EXIT":
                  wonBy = "Resigantion";
                  break;
                case "COMPLETED":
                  wonBy =
                    message.payload.result !== "DRAW" ? "CheckMate" : "Draw";
                  // console.log(wonBy, "!!! GAME OVER:", payload);
                  break;
                case "TIME_OUT":
                  wonBy = "TimeOut";
                  break;
              }
              setGameStatus(wonBy);
              localStorage.removeItem("roomData");
              setRoomId(undefined);
              chess.reset();
            }
            break;
          case CHAT:
            setMessages((prev) => [...prev||[], payload.message]);
            break;
          case GAME_ALERT:
            setConnecting(false);
            setActiveTab("newgame");
            setGameAlert(payload.message);
            break;
          case GAME_ADDED:
            {
              setRoomId(message.gameId);
              const rmid = message.gameId;
              const expiryTime = Date.now() + 15 * 60 * 1000; // 15 minutes in ms
              localStorage.setItem(
                "roomData",
                JSON.stringify({ rmid, expiryTime })
              );
              if(!message.private)
              {setConnecting(true);
              setActiveTab("play");}
            }
            break;
          case NOTIFICATION:
            // console.log(message.payload);
            notify(message.payload || "info");
            break;
          case UNDO_MOVE:
            setUndoRequested(payload.requestingPlayerId !== user?.id);
            
            break;
          case UNDO_MOVE_APPROVE:
            {
              chess.load(payload.revertedfen);
              const newBoard = chess.board();
              setBoard(newBoard);
              const moveTo = (payload.moves as Move[]).map((move) => move.to);
              setMoves(moveTo);
              
              setWaitingResponse(false)
              setUndoBox(false)
              setUndoRequested(false);
            }
            break;
        }
      };
    }
    //empty localstorage afte 1 min
    const stored = localStorage.getItem("roomData");
    const data = stored ? JSON.parse(stored) : null;
    if (data && data.expiryTime !== 0) {
      if (Date.now() > data.expiryTime) {
        localStorage.removeItem("roomData");
        console.log("localstorage roomId expired");
      }
    }
    //Reconnection if no RoomId in Localstorage
    if (roomId !== data?.rmid) {
      console.log("Reconnection triggered!!!");
      socket.send(
        JSON.stringify({
          type: RECONNECT,
          payload: {
            roomId: data.rmid,
          },
        })
      );
    }
  }, [socket, chess]);

  return (
    <ChessContext.Provider
      value={{
        Opponent,
        setOpponent,
        gameType,
        setGameType,
        gameStarted,
        setGameStarted,
        connecting,
        setConnecting,
        roomId,
        setRoomId,
        Messages,
        setMessages,
        activeTab,
        setActiveTab,
        color,
        setColor,
        chess,
        setChess,
        board,
        setBoard,
        moves,
        setMoves,
        playerWon,
        setPlayerWon,
        gameStatus,
        setGameStatus,
        gameAlert,
        setGameAlert,
        gameEnded,
        setGameEnded,
        undoRequested,
        setUndoRequested,
        undoBox,setUndoBox,
        waitingResponse,
        setWaitingResponse,
        boardAppearnce,
        setBoardAppearnce
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};
