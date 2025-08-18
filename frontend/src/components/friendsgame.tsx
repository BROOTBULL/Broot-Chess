import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHook";
import { useSendNotification } from "../hooks/NotificationHook";

export const FriendsGame = () => {
 const { friends,theme } = useUserContext();
 const navigate=useNavigate()
 const {sendNotification}=useSendNotification()
  return (
    <div className={`lg:w-[50%] w-full h-fit mb-4`}>
      <div className="flex justify-between my-1 font-bold">
        <div className={` ${theme?" text-zinc-700":" text-zinc-300"} text-md lg:text-2xl cursor-default`}>
          Friends
        </div>
        <button
        onClick={()=>navigate("/social")}
        className={` ${theme?" text-zinc-700":" text-zinc-300"} text-md lg:text-xl ml-auto cursor-pointer `}>
          See all
        </button>
      </div>
      <div className={`flex flex-row md:gap-1 overflow-x-auto overflow-hidden scroll-smooth `}>
         
          {friends && friends.length > 0 ? (
            friends.map((friend,i) => {
              return (
        <div 
        onClick={() => navigate(`/profile/${friend?.id}`)}
        key={i} className={`min-w-[120px] md:min-w-[180px] flex flex-col ${theme?" bg-zinc-400":"bg-zinc-900"} items-center shadow-md/50 p-2 mr-3 mb-3 rounded-md cursor-pointer`}>
          <img
            className="size-20 md:size-35 xl:size-45 drop-shadow-md rounded-md border-2 border-zinc-700 "
            src={friend.profile?friend.profile:"/media/chessboard.png"} // Use public path in React
            alt="chess"
          />
          <div 
          onClick={() => navigate(`/profile/${friend?.id}`)}
          className={`${theme?" text-zinc-800":"text-zinc-200"} font-[500] text-[13px] flex flex-col md:flex-row items-center hover:font-bold duration-75`}>
            {friend.name} 
            <div>({friend.rating.rapid})</div>
          </div>
          <div
            onClick={()=>sendNotification(friend.id,"CHALLENGE","Challenged you for a friendly Rapid Match")}
            className="bg-zinc-800 m-1 rounded-md drop-shadow-sm w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <div className="text-zinc-200 font-bold text-sm md:text-md ">
              Challenge
            </div>
          </div>
        </div>)})): (
            <div className={`"]text-center text-zinc-800 ${theme?"":"invert"} text-md h-40 w-full flex items-center justify-center`}><div>No friends yet</div></div>
          )}
      </div>
    </div>
  );
};
