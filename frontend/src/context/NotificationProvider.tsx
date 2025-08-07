import { createContext, useContext, useState, ReactNode } from "react";
import { motion } from "motion/react";
import { User } from "./userProvider";
import { NotifType } from "../screens/socials";
import { useUserContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSendNotification } from "../hooks/NotificationHook";

const JOINROOM = "joinroom";

type Notification = {
  id: number;
  sender: User;
  notifType: NotifType;
  message: string;
  roomId?: string;
};

interface NotificationContextType {
  notify: (notif: Omit<Notification, "id">) => void;
  triggerRefresh: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const {setReloadData}=useUserContext()

  const notify = (notif: Omit<Notification, "id">) => {
    const id = Date.now(); // generate unique id
    setNotifications((prev) => [...prev, { id, ...notif }]);
    setTriggerRefresh((prev) => !prev);
    if(notif.notifType==="ACCEPT")
    setReloadData((prev)=>!prev)
    // remove it after 15 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 15*1000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  function renderButton(
    notifType: NotifType,
    roomId: string,
    id: number,
    remove: (id: number) => void,
    sender: User,
    messageId: string
  ) {
    switch (notifType) {
      case "CHALLENGE":
        return (
          <ChallengeButtons roomId={roomId} notifId={id} onRemove={remove} />
        );
      case "REQUEST":
        return (
          <RequestButtons
            notifId={id}
            onRemove={remove}
            sender={sender}
            messageId={messageId}
          />
        );
      case "MESSAGE":
        return (
          <div className="h-full min-h-15 md:min-h-24 w-[20%] ml-auto flex items-center justify-center">
            <button 
            onClick={()=>remove(id)}
            className="ml-13 mb-13 absolute cursor-pointer"><img className="rotate-45 size-6 invert" src="./media/closeOption.png" alt="" /></button>
            <div onClick={()=>{
               const form = document.getElementById(sender.userId);
                             form?.classList.toggle("hidden");
            }} className="cursor-pointer text-zinc-100 hover:text-zinc-300">
              Reply
            </div>
          </div>
        );
      case "ACCEPT":
      default:
        return <>
        <button 
            onClick={()=>remove(id)}
            className="ml-auto cursor-pointer"><img className="rotate-45 size-6 invert" src="./media/closeOption.png" alt="" /></button>
            </>;
    }
  }

  return (
    <NotificationContext.Provider value={{ notify,triggerRefresh }}>
      {children}

      <div className="fixed top-4 right-2 z-[9999] space-y-2">
        {notifications.map((n) => (
          <motion.div
            initial={{ opacity: 0.5, x: 100 }} // start off right and invisible
            animate={{ opacity: 1, x: 0 }} // slide in to position
            exit={{ opacity: 0.5, x: 100 }} // slide out to right again
            transition={{ duration: 0.2 }}
            key={n.id}
            className={`bg-zinc-800 min-h-15 md:min-h-25 h-fit w-92 md:w-120 rounded-2xl text-white shadow-2xl/70`}
          >
            <div className="h-full w-full flex flex-row p-2">

              <div className="rounded-lg md:h-full h-15 aspect-square border-2 border-zinc-700">
                <img
                  className="h-full max-h-22"
                  src={n.sender.profile || "./media/userW.png"}
                  alt=""
                />
              </div>
              <div className="bg-zinc-800 p-2 max-w-[80%] w-fit h-full min-h-15 md:min-h-24 flex flex-col justify-center">
                <div className="text-lg font-bold text-zinc-200 ">
                  {n.sender.name}
                </div>
                <div className="text-sm text-zinc-300 ">
                  {n.notifType === "REQUEST"
                    ? "Sent a Friend Request"
                    : n.message}
                </div>
              </div>
              {renderButton(
                n.notifType,
                n.roomId as string,
                n.id,
                removeNotification,
                n.sender,
                n.message
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context.notify;
};

export const useNotificationRefresh = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationRefresh must be used within a NotificationProvider");
  }
  return context.triggerRefresh;
};

const ChallengeButtons = ({
  roomId,
  notifId,
  onRemove,
}: {
  roomId: string;
  notifId: number;
  onRemove: (id: number) => void;
}) => {
  console.log(roomId);

  const { socket } = useUserContext();
  const navigate = useNavigate();

  function handleAccept() {
    if (roomId)
      socket?.send(
        JSON.stringify({
          type: JOINROOM,
          payload: {
            roomId: roomId,
          },
        })
      );
    onRemove(notifId);
    navigate("/game");
  }

  return (
    <div className="h-full w-[20%] ml-auto">
      <div
        onClick={() => handleAccept()}
        className="text-sm text-zinc-100 text-center bg-emerald-800 rounded-tr-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-emerald-700 m-1"
      >
        Accept
      </div>
      <div className="text-sm text-zinc-100 text-center bg-zinc-700 rounded-br-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-zinc-600 m-1 ">
        <img
          className="size-5 rotate-45 mx-auto"
          src="./media/plus.png"
          alt=""
        />
      </div>
    </div>
  );
};

const RequestButtons = ({
  sender,
  onRemove,
  notifId,
  messageId,
}: {
  sender: User;
  onRemove: (id: number) => void;
  notifId: number;
  messageId: string;
}) => {
  const { user } = useUserContext();
  const { sendNotification } = useSendNotification();

  async function handleRequest(player: User) {
    const response = await axios.post("/social/reqPlayer", {
      senderId: user?.id,
      receiverId: player.userId,
    });
    const responseReqMessage = await axios.post("/social/message", {
      message: "Accepted your Friend Request",
      user: user,
      friendId: player.userId,
      type: "ACCEPT",
    });
    sendNotification(sender.userId, "ACCEPT", "Accepted your Friend Request");
    sendNotification(user?.id as string, "ACCEPT", `You and ${sender.name} are Friends Now`);
    const responseDeleteMessage = await axios.post("/social/deletemessage", {
      messageId: messageId,
    });
    console.log(responseDeleteMessage);
    console.log(response.data.message, " ", responseReqMessage.data.message);
    onRemove(notifId);
  }

  return (
    <div className="h-full w-[25%] ml-auto">
      <div
        onClick={() => handleRequest(sender)}
        className="text-sm text-zinc-100  text-center bg-emerald-800 rounded-tr-lg rounded-[2px] p-1 md:p-2 px-4 cursor-pointer hover:bg-emerald-700 m-0.5 md:m-1 "
      >
        Accept
      </div>
      <div
        onClick={() => onRemove(notifId)}
        className="text-sm text-zinc-100 text-center bg-zinc-700 rounded-br-lg rounded-[2px] p-1 md:p-2 px-4 cursor-pointer hover:bg-zinc-600 m-0.5 md:m-1 "
      >
        Decline
      </div>
    </div>
  );
};
