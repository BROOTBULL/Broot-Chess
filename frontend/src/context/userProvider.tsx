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


interface UserContextProviderType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>
  friends: User[] | [];
  setFriends: React.Dispatch<React.SetStateAction<User[] | []>>
}




export const UserContext = createContext<UserContextProviderType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);
  

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
      console.log(cookieStore);
      
      
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
    const getFriends = async () => {
      const response = await axios.get("/social/friends", {
        params: { userId: user?.id },
      });
      setFriends(response.data.Friends);
      console.log(response.data.Friends);
      
    };

      getFriends();
  }, [user]);


  return (
    <UserContext.Provider value={{
        user,
        setUser,
        socket,
        setSocket,
        loading,
        friends,
        setFriends
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
