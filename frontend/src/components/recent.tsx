import { useUserContext } from "../hooks/contextHook";
import { useSendNotification } from "../hooks/NotificationHook";

export const RecentGame = () => {

  const{games}=useUserContext()
  const {sendNotification}=useSendNotification()

  return (
    <div className="w-full h-fit my-5 ring-1 ring-zinc-400 rounded-lg ">
      <div className="flex justify-between m-2 my-1 font-bold">
        <span className=" text-zinc-700 text-md lg:text-2xl cursor-default">
          Recent Matchs
        </span>
      </div>
          <div className="flex flex-row ring-1 ring-zinc-400 overflow-x-auto overflow-hidden custom-scroll-w scroll-smooth rounded-b-lg py-1">

      {games.length?games.map((game)=>{
        return(
        <div
        key={game.id}
        className="min-w-[290px] md:min-w-[360px] m-2 flex flex-row bg-zinc-400 rounded-md shadow-md/50 p-2">
          <img
            className="size-35 md:size-45 drop-shadow-md mr-4 border-2 border-zinc-700 rounded-md"
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <div className="flex flex-col w-full">
            <span className="text-zinc-800 font-bold text-sm">
              {game.opponent.name} ({game.opponent.rating})
            </span>
            <span className="text-sm text-zinc-600 font-[600]">
              <span className="text-green-900">11</span> /{" "}
              <span className="text-zinc-800">1</span> /{" "}
              <span className="text-red-700">2</span>
            </span>
            <div
              onClick={() =>sendNotification(game.opponent.id,"CHALLENGE","Challenged you for a Rematch") }
              className="bg-emerald-800 hover:bg-emerald-700 duration-200 cursor-pointer w-fit p-2 shadow-md/30 flex self-end mt-auto items-center justify-center flex-row rounded-md"
            >
              <span className="text-zinc-200 font-bold text-sm">Challenge</span>
            </div>
          </div>
      </div>
        )
      }):<></>}
        </div>
    </div>
  );
};


