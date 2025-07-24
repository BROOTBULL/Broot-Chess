import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import {motion} from "motion/react"
import { User } from "./ContextProvider";
import { NotifType } from "../screens/socials";
import { useUserContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";

const JOINROOM = "joinroom";

type Notification = {
  id: number;
  player: User;
  notifType: NotifType;
  message: string;
  roomId?: string;
};

interface NotificationContextType {
  notify: (notif: Omit<Notification, "id">) => void;
}


const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

const notify = (notif: Omit<Notification, "id">) => {
  const id = Date.now(); // generate unique id
  setNotifications((prev) => [...prev, { id, ...notif }]);
  // remove it after 15 seconds
  setTimeout(() => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, 15000);
};

const removeNotification = (id: number) => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
};

function renderButton(notifType:NotifType,roomId:string,id: number,remove: (id: number) => void)
{
  switch(notifType)
  {
    case "CHALLENGE":
    return <ChallengeButtons roomId={roomId} notifId={id} onRemove={remove}/>;
    case "REQUEST":
    return<RequestButtons/>;
    case "MESSAGE":
    return(<div>Reply</div>);
    case "ACCEPT":
    default:
      return(<></>)
  }
}


  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      <div
       className="fixed top-4 right-4 z-[9999] space-y-2">
        {notifications.map((n) => (
          <motion.div
           initial={{ opacity: 0.5, x: 100 }}      // start off right and invisible
           animate={{ opacity: 1, x: 0 }}        // slide in to position
           exit={{ opacity: 0.5, x: 100 }}         // slide out to right again
           transition={{ duration: 0.2 }}
            key={n.id}
            className={`bg-zinc-800 h-25 w-120 rounded-2xl text-white shadow-2xl/70`}>
        <div className="h-full w-full flex flex-row p-2">
            <div className="rounded-lg h-full aspect-square border-2 border-zinc-700">
                <img className="h-full" src={n.player.profile||"./media/userW.png"} alt="" />
            </div>
            <div className="bg-zinc-800 p-2 max-w-[80%] w-fit h-full flex flex-col justify-center">
                <div className="text-lg font-bold text-zinc-200 ">{n.player.username}</div>
                <div className="text-sm text-zinc-400 ">{n.message}</div>

            </div>
            {renderButton(n.notifType, n.roomId as string, n.id, removeNotification)}

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
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context.notify;
};



const ChallengeButtons =({
  roomId,
  notifId,
  onRemove
}: {
  roomId: string;
  notifId: number;
  onRemove: (id: number) => void;
}) =>{
  console.log(roomId);
  
  const {socket}=useUserContext()
  const navigate=useNavigate()

  
   function handleAccept() {
    if(roomId)
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

  return(<div className="h-full w-[25%] ml-auto">
                <div 
                onClick={()=>handleAccept()}
                className="text-sm text-zinc-100 bg-emerald-800 rounded-tr-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-emerald-700 m-1">
                    Accept
                </div>
                <div className="text-sm text-zinc-100 bg-zinc-700 rounded-br-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-zinc-600 m-1 ">
                    <img className="size-5 rotate-45 mx-auto" src="./media/plus.png" alt="" />
                </div>
          </div>
  )
}

const RequestButtons =()=>{

  
  function handleAcceptReq()
  {

  }

  return(
               <div className="h-full w-[25%]">
                <div 
                onClick={()=>handleAcceptReq()}
                className="text-sm text-zinc-100 bg-emerald-800 rounded-tr-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-emerald-700 m-1">
                    Accept
                </div>
                <div className="text-sm text-zinc-100 bg-zinc-700 rounded-br-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-zinc-600 m-1 ">
                    Decline
                </div>
            </div>
  )
}
