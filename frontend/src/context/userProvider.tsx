import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  userId:string;
  username: string;
  name: string;
  email: string;
  rating: number;
  profile: string;
  token: string;
}

export type GameType="CLASSICAL"|"RAPID"|"BLITZ"
export type GameResult="BLACK WINS"|"WHITE WINS"|"DRAW"

export type GamesData={
                id: string,
              opponent: {
                  id: string,
                  username: string,
                  name: string,
                  email: string,
                  profile: null|string,
                  provider: string,
                  rating: number,
                  createdAt:Date
              },
              timeControl: GameType,
              startAt:Date,
              result: string
              playedAs:string
}


interface UserContextProviderType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
  friends: User[] | [];
  setFriends: React.Dispatch<React.SetStateAction<User[] | []>>
  games: GamesData[] | [];
  setGames: React.Dispatch<React.SetStateAction<GamesData[] | []>>
  reloadData:boolean;
  setReloadData:React.Dispatch<React.SetStateAction<boolean>>
  theme:boolean;
  setTheme:React.Dispatch<React.SetStateAction<boolean>>
}




export const UserContext = createContext<UserContextProviderType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);
  const [games, setGames] = useState<GamesData[]>([]);
  const [reloadData,setReloadData] = useState(false);
  const [theme,setTheme] = useState<boolean>(localStorage.getItem("theme")==="false");


  

useEffect(() => {
  if (!user) return;

  const isProd = import.meta.env.MODE === "production";

  const WS_URL = isProd
    ? `wss://broot-chess-ws.onrender.com?token=${user.token}`
    : `ws://localhost:8080?token=${user.token}`; // use the actual WS port locally

  const ws = new WebSocket(WS_URL);

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

    useEffect(() => {

    if(!user)return;  

    const getFriends = async () => {
      const response = await axios.get("/social/friends", {
        params: { userId: user?.id },
      });
      setFriends(response.data.Friends);
      
    };
    
      getFriends();
  }, [user,reloadData]);

    useEffect(() => {

    if(!user)return;  
    const getGames = async () => {
      const response = await axios.get("/gameData/games", {
        params: { userId: user?.id },
      });
      setGames(response.data.games)
      console.log(response.data.games);
      
    };

      getGames()
  }, [user,reloadData]);



  return (
    <UserContext.Provider value={{
        user,
        setUser,
        socket,
        setSocket,
        loading,
        friends,
        setFriends,
        games,
        setGames,
        reloadData,
        setReloadData,
        theme,
        setTheme
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
