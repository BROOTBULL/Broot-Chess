import { format } from "date-fns";
import { useSendNotification } from "../hooks/NotificationHook";
import { GamesData } from "../context/userProvider";
import { useUserContext } from "../hooks/contextHook";
import { useNavigate, useParams } from "react-router-dom";

export const GameHistory = ({games}:{games:GamesData[]}) => {
  const {user}=useUserContext()
  const { sendNotification } = useSendNotification();
  const activetab = window.location.pathname.split("/").filter(Boolean)[0];
  const isProfilePage=activetab==="profile"
  const playerId=useParams() 
  const isUserProfilePage=user&&(user.id===playerId.playerId)
  const navigate=useNavigate()
  


  return (
    <div className="flex flex-col Profile h-full w-full mt-5 bg-zinc-800 rounded-lg pb-2 ring-1 ring-zinc-900 drop-shadow-2xl">
      <div className="flex text-zinc-200 text-md lg:text-2xl lg:p-2 font-bold m-2 cursor-default">
        Game History
      </div>

      <div className="flex flex-col Profile w-full bg-zinc-900">
        <div className="font-serif flex flex-row text-zinc-200 bg-zinc-950 text-sm font-[500] p-1 gap-2 text-center">
          <div className="flex-1">Time</div>
          <div className="flex-5">Player</div>
          <div className="flex-1">Result</div>
          <div className="flex-2">Date</div>
          <div className={`${isProfilePage&&!isUserProfilePage?"hidden":"flex"} flex-2`}>Rematch</div>
        </div>

        {games.length?
        
        (<div className="w-full min-h-40 max-h-150 scroll-smooth overflow-auto custom-scroll bg-zinc-900">
          {games?.sort((a, b) => (new Date(b.startAt)).getTime() - (new Date(a.startAt)).getTime()).map((game) => (
          <div
            key={(new Date(game.startAt)).getTime()}
            className={`flex flex-row text-zinc-200 text-sm font-[400] p-1 py-2 border-b-2 border-zinc-900 ${game.result==="Draw"?"bg-zinc-400/10":(game.result==="Loss"?"bg-rose-600/10":"bg-emerald-600/20")} items-center text-center gap-2`}
          >
            <div className="flex-1 flex justify-center">
              <img className="size-5 mx-1" src={`/media/${game.timeControl.toLowerCase()}.png`} alt="" />
            </div>
            <div 
            onClick={() => navigate(`/profile/${game.opponent.id}`)}
            className="flex-5 truncate flex-row flex justify-center">
              <img className={`${game.playedAs==="white"?"":"invert"} drop-shadow-zinc-500 drop-shadow-sm size-5 mr-1`} src={`/media/pawn.png`} alt="" />
              <div className="cursor-pointer">{game.opponent?.name || game.opponent?.username}</div>
            </div>
            <div className="flex-1 flex justify-center"><div className={`size-5 aspect-square rounded ${game.result==="Draw"?"bg-zinc-400":(game.result==="Loss"?"bg-rose-500":"bg-emerald-600")}`}><img className={`size-5 invert mr-1`} src={`/media/${game.result==="Loss"?"minus":(game.result==="Draw"?"friends":"plus")}.png`} alt="" /></div></div>
            <div className="flex-2 cursor-pointer ">
              {format(new Date(game.startAt), "dd MMM")}
            </div>
            <div className={`flex-2 ${isProfilePage&&!isUserProfilePage?"hidden":"flex"} justify-center`}>
              <button
                className="bg-emerald-900/80 hover:bg-emerald-700 text-white p-1 text-xs rounded flex flex-row"
                onClick={() =>
                  sendNotification(
                    game.opponent.id,
                    "CHALLENGE",
                    "Challenged you for a Rematch"
                  )
                }
              >
                <img className="size-5 " src="/media/challenge.png" alt="" /><div className="lg:flex hidden "> Rematch</div>
              </button>
            </div>
          </div>
        ))}
        </div>
        ):(<div className="h-40 flex justify-center items-center w-full"> <div className="text-zinc-200">No Matches played yet</div></div>)
      }
      </div>
    </div>
  );
};
