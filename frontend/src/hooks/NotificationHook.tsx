// hooks/useSendNotification.ts
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./contextHook";
import { NOTIFICATION, NotifType } from "../screens/socials";
import { INIT_GAME } from "../context/ContextProvider";

export function useSendNotification() {
  const navigate = useNavigate();
  const { socket } = useUserContext(); // or however you're using socket

  const sendNotification = async (
    playerId: string,
    notifType: NotifType,
    message: string
  ) => {

    if (socket) {
      console.log(playerId, notifType);
      if(notifType==="CHALLENGE")
      socket.send(
        JSON.stringify({
          type: INIT_GAME,
          private: true,
        })
      );

      socket.send(
        JSON.stringify({
          type: NOTIFICATION,
          payload: {
            playerId,
            notifType,
            message,
          },
        })
      );
      if(notifType==="CHALLENGE")
      navigate("/game");
    }
  };

  return { sendNotification };
}
