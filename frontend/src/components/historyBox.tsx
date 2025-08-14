import { format } from "date-fns";
import { useSendNotification } from "../hooks/NotificationHook";
import { useUserContext } from "../hooks/contextHook";
import { useNavigate } from "react-router-dom";

export const History = () => {
  const { games } = useUserContext();
  const {sendNotification} = useSendNotification();
  const navigate=useNavigate()

  return (
    <div className="p-3 h-[93%] w-full bg-zinc-700 max-w-[1000px]">
      <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900 justify-between">
        <div className="h-[93%] max-h-120 md:max-h-full flex flex-col">
          <div className="font-serif flex flex-row text-zinc-200 bg-zinc-950 text-sm font-[500] p-2 gap-2 text-center">
            <div className="flex-1">
              <img className="size-5 mx-auto" src="/media/timer.png" alt="" />
            </div>
            <div className="flex-5">Player</div>
            <div className="flex-2">Result</div>
            <div className="flex-3">Date</div>
            <div className="flex-1">Rematch</div>
          </div>
<div className="smooth-scroll overflow-auto custom-scroll">
  
          {games.sort((a, b) => (new Date(b.startAt)).getTime() - (new Date(a.startAt)).getTime()).map((game) => (
            <div
              key={(new Date(game.startAt)).getTime()}
              className={`flex flex-row text-zinc-200 ${game.result==="Draw"?"bg-zinc-400/20":(game.result==="Loss"?"bg-rose-600/10":"bg-emerald-600/20")} text-sm font-[500] p-2 gap-2 text-center`}
            >
              <div className="flex-1">
                <img
                  className="size-5 mx-auto"
                  src={`./media/${(game.timeControl).toLowerCase()}.png`}
                  alt=""
                />
              </div>
              <div
               onClick={() => navigate(`/profile/${game.opponent?.id}`)}
               className="flex-5 cursor-pointer">
                {game.opponent.name || game.opponent.username}
              </div>
              <div className="flex-2 flex justify-center"><div className={`size-5 aspect-square rounded ${game.result==="Draw"?"bg-zinc-400":(game.result==="Loss"?"bg-rose-500/60":"bg-emerald-600")}`}><img className={`size-5 invert mr-1`} src={`./media/${game.result==="Loss"?"minus":"plus"}.png`} alt="" /></div></div>
              <div className="flex-3 text-[12px] cursor-pointer">
                {format(new Date(game.startAt), "dd MMM yyyy")}
              </div>
              <div
                onClick={()=>sendNotification(game.opponent.id,"CHALLENGE","Challenged you for a Rematch")}
                className="flex-1 bg-emerald-700 p-1 text-[10px] cursor-pointer"
              >
                Rematch
              </div>
            </div>
          ))}
</div>
        </div>

        <div 
        onClick={()=>navigate("/history")}
        className="w-full flex justify-center items-center py-3 text-lg font-bold text-zinc-200 bg-zinc-500">
          <img
            className="size-6 justify-self-center mx-1"
            src="/media/history.png"
            alt=""
          />
          Game History
        </div>
      </div>
    </div>
  );
};
