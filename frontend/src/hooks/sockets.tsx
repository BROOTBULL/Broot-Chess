import { useEffect, useRef, useState } from "react";
import { useChessContext } from "./contextHook";

export const useSocket = () => {
  const WS_URL = "ws://localhost:8080";
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const isOpen = useRef(false); // useRef to persist across renders
  const {user}=useChessContext();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${user?.token}`);

    ws.onopen = () => {
      console.log("Connected to ws");
      setSocket(ws);
      isOpen.current = true; // set ref
    };

    ws.onclose = () => {
      console.log("Disconnected from ws");
      setSocket(null);
    };

    return () => {
      if (isOpen.current) {
        console.log("Closing websocket");
        ws.close();
      }
    };
  }, [user]);

  return socket;
};
