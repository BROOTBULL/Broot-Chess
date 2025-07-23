import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {motion} from "motion/react"
import { User } from "./ContextProvider";

type Notification = {
  id: number;
  player:User;
  type?: "info" | "success" | "error";
};

interface NotificationContextType {
  notify: (player: User, type?: Notification["type"]) => void;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (player: User, type: Notification["type"] = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, player, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 15000);
  };

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
            <div className="bg-zinc-800 p-2 max-w-[80%] w-full h-full flex flex-col justify-center">
                <div className="text-lg font-bold text-zinc-200 ">{n.player.username}</div>
                <div className="text-sm text-zinc-400 ">Challenged you for a {n.type} Match</div>

            </div>

            <div className="h-full w-[25%]">
                <div className="text-sm text-zinc-100 bg-emerald-800 rounded-tr-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-emerald-700 m-1">
                    Accept
                </div>
                <div className="text-sm text-zinc-100 bg-zinc-700 rounded-br-lg rounded-[2px] p-2 px-4 cursor-pointer hover:bg-zinc-600 m-1 ">
                    <img className="size-5 rotate-45 mx-auto" src="./media/plus.png" alt="" />
                </div>
            </div>

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
