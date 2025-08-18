import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHook";
import { useSendNotification } from "../hooks/NotificationHook";

export const RecentGame = () => {

  const{games,theme}=useUserContext()
  const navigate=useNavigate()
  const {sendNotification}=useSendNotification()

  return (
    <div className={`w-full h-fit my-5`}>
      <div className="flex justify-between my-1 font-bold">
        <div className={` ${theme?" text-zinc-700":" text-zinc-300"}  text-md lg:text-2xl cursor-default`}>
          Recent Matchs
        </div>
      </div>
          <div className={`flex flex-row overflow-x-auto overflow-hidden ${theme?"custom-scroll-w":"custom-scroll"} scroll-smooth rounded-b-lg `}>

      {games.length?games.slice(-5).map((game)=>{
        return(
        <div
        key={game.id}
        onClick={() => navigate(`/profile/${game.opponent?.id}`)}
        className={`min-w-[290px] md:min-w-[360px] mr-3 mb-3 flex flex-row cursor-pointer ${theme?" bg-zinc-400":"bg-zinc-900"} rounded-md shadow-md/50 p-2`}>
          <img
            className="size-30 md:size-45 drop-shadow-md mr-4 border-2 border-zinc-700 rounded-md"
            src={game.opponent.profile?game.opponent.profile:"/media/chessboard.png" }// Use public path in React
            alt="chess"
          />
          <div className="flex flex-col w-full">
            <div 
            onClick={() => navigate(`/profile/${game.opponent?.id}`)}
            className={`${theme?" text-zinc-800":"text-zinc-200"} font-bold text-sm cursor-pointer`}>
              {game.opponent.name} ({game.opponent.rating.rapid})
            </div>
            <div className="text-[10px] text-zinc-600 font-bold">{game.timeControl}</div>
            <div
              onClick={() =>sendNotification(game.opponent.id,"CHALLENGE","Challenged you for a Rematch") }
              className="bg-zinc-800 hover:bg-emerald-700 duration-200 cursor-pointer w-fit p-2 shadow-md/30 flex self-end mt-auto items-center justify-center flex-row rounded-md"
            >
              <div className="text-zinc-200 font-bold text-sm">Challenge</div>
            </div>
          </div>
      </div>
        )
      }):<div className={`${theme?"":"invert"} text-zinc-800 h-40 flex justify-center items-center w-full`}> <div>No Matches played yet</div></div>}
        </div>
    </div>
  );
};


