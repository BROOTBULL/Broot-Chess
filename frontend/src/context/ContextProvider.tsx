import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNotification } from "./NotificationProvider";
import { NOTIFICATION } from "../screens/socials";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  rating: number;
  profile: string;
  token: string;
}

interface ChessContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  Opponent: User | null;
  setOpponent: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  connecting: boolean;
  setConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string | undefined;
  setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  Messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>
}

type GameType = "blitz" | "rapid" | "daily" | "";
type Message = { sender: string; message: string };
  type Tab = "newgame" | "history" | "friends" | "play";


export const ChessContext = createContext<ChessContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [Opponent, setOpponent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [gameType, setGameType] = useState<GameType>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [Messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("newgame");
  const [color, setColor] = useState("white");



  // ✅ WebSocket connection logic here directly
  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${user.token}`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setSocket(null);
    };

    return () => {
      console.log("🔌 Closing WebSocket...");
      ws.close();
    };
  }, [user]);

  // ✅ Auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/checkAuth");
        if (res.data.isAuthanticated) {
          setUser(res.data.UserDetails);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);


const notify = useNotification();

useEffect(() => {
  if (!socket) return;

  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    console.log(message);

    switch (message.type) {
      case NOTIFICATION:
        console.log("swit triggered")
        notify(message.payload.player, message.payload.type || "info");
        break;

      // other cases...
    }
  };
}, [socket]);


  return (
    <ChessContext.Provider
      value={{
        user,
        setUser,
        Opponent,
        setOpponent,
        loading,
        gameType,
        setGameType,
        gameStarted,
        setGameStarted,
        connecting,
        setConnecting,
        roomId,
        setRoomId,
        socket,
        setSocket,
        Messages,
        setMessages,
        activeTab, 
        setActiveTab,
        color,
        setColor
      }}
    >
      {children}
    </ChessContext.Provider>
  );
};
