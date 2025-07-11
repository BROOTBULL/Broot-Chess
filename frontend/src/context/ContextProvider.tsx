import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  username: string;
  name:string;
  email: string;
  rating: number;
  profile:string;
  token:string
}

interface ChessContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  Opponent: User | null;
  setOpponent: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  gameType:GameType;
  setGameType:React.Dispatch<React.SetStateAction<GameType>>;
  gameStarted:boolean;
  setGameStarted:React.Dispatch<React.SetStateAction<boolean>>
  connecting:boolean;
  setConnecting:React.Dispatch<React.SetStateAction<boolean>>
  roomId:string;
  setRoomId:React.Dispatch<React.SetStateAction<string>>
}

type GameType="blitz"|"rapid"|"daily"|"";

export const ChessContext = createContext<ChessContextType | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roomId,setRoomId]=useState<string>("randomRoomId")
  const [Opponent, setOpponent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [gameType,setGameType]=useState<GameType>("")
  const [gameStarted, setGameStarted] = useState(false);

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

  return (
    <ChessContext.Provider value={{ user, setUser, loading,gameType,setGameType ,gameStarted,setGameStarted,connecting,setConnecting,Opponent,setOpponent,roomId,setRoomId}}>
      {children}
    </ChessContext.Provider>
  );
};
