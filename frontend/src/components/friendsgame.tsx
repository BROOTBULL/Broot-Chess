import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHook";
import { useSendNotification } from "../hooks/NotificationHook";

export const FriendsGame = () => {
 const { friends,theme } = useUserContext();
 const navigate=useNavigate()
 const {sendNotification}=useSendNotification()
  return (
    <div className={`lg:w-[50%] w-full h-fit ring-1 ${theme?" ring-zinc-400":" ring-zinc-600"} rounded-lg mb-3`}>
      <div className="flex justify-between m-2 my-1 font-bold">
        <span className={` ${theme?" text-zinc-700":" text-zinc-300"} text-md lg:text-2xl cursor-default`}>
          Friends
        </span>
        <button
        onClick={()=>navigate("/social")}
        className={` ${theme?" text-zinc-700":" text-zinc-300"} text-md lg:text-xl ml-auto cursor-pointer `}>
          See all
        </button>
      </div>
      <div className={`flex flex-row ring-1 md:gap-1 ${theme?" ring-zinc-400":" ring-zinc-600"} overflow-x-auto custom-scroll-w overflow-hidden scroll-smooth rounded-b-lg `}>
         
          {friends && friends.length > 0 ? (
            friends.map((friend,i) => {
              return (
        <div key={i} className={`min-w-[120px] md:min-w-[180px] flex flex-col ${theme?" bg-zinc-400":"bg-zinc-900"} items-center shadow-md/50 p-2 m-2 rounded-md`}>
          <img
            className="size-20 md:size-35 xl:size-45 drop-shadow-md rounded-md border-2 border-zinc-700 "
            src={friend.profile?friend.profile:"/media/chessboard.png"} // Use public path in React
            alt="chess"
          />
          <div className={`${theme?" text-zinc-800":"text-zinc-200"} font-[500] text-[13px] flex flex-wrap items-center`}>
            {friend.name} 
            <div>({friend.rating.rapid})</div>
          </div>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">{Math.floor(Math.random()*10)}</span> /{" "}
            <span className="text-zinc-400">{Math.floor(Math.random()*10)}</span> /{" "}
            <span className="text-red-700">{Math.floor(Math.random()*10)}</span>
          </span>
          <div
            onClick={()=>sendNotification(friend.id,"CHALLENGE","Challenged you for a friendly Rapid Match")}
            className="bg-emerald-800 rounded-md drop-shadow-sm w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md ">
              Challenge
            </span>
          </div>
        </div>)})): (
            <div className={`"]text-center text-zinc-800 ${theme?"":"invert"} text-md h-40 w-full flex items-center justify-center`}><div>No friends yet</div></div>
          )}
      </div>
    </div>
  );
};
