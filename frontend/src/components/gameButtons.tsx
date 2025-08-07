import { useNavigate } from "react-router-dom";
import { useChessContext, useUserContext } from "../hooks/contextHook";

export const GameButtons = () => {
  const navigate = useNavigate();
  const { setGameType, setActiveTab } = useChessContext();
  const {theme}=useUserContext()

  return (
    <>
      <div className="flex flex-col h-fit gap-3 w-auto my-auto lg:w-[50%] ">
        <div
          className="bg-emerald-900 rounded-lg playButton h-15 md:h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50  "
          onClick={() => navigate(`/game`)}
        >
          <img className="size-6 m-1 " src="/media/pawn.png" alt="" />
          <div className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play Online
          </div>
        </div>
        <div
          onClick={() => {
            navigate("/game");
            setGameType("blitz");
          }}
          className={` ${theme?" bg-zinc-800":" bg-zinc-900"} rounded-lg playButton h-15 md:h-18 hidden lg:flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50 `}
        >
          <img className="size-6 m-1 " src="/media/blitz.png" alt="" />
          <div className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play Blitz
          </div>
        </div>

        <div className="playOptions flex flex-row lg:flex-col gap-2.5  ">
          <div
            onClick={() => {
              navigate("/game");
              setActiveTab("friends");
            }}
            className={` ${theme?" bg-zinc-800":" bg-zinc-900"} rounded-lg playButton h-15 md:h-18 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-[50%] lg:w-full`}
          >
            <img className="size-8 m-1 " src="/media/friends.png" alt="" />
            <div className="font-serif text-zinc-100 text-md md:text-2xl">
              Play a Friend
            </div>
          </div>
          <div className={` ${theme?" bg-zinc-800":" bg-zinc-900"} rounded-lg playButton h-15 md:h-18 flex flex-row items-center justify-center cursor-no-drop shadow-md/50 w-[50%] lg:w-full`}>
            <img className="size-7 m-1 mb-2" src="/media/bot.png" alt="" />
            <div className="font-serif text-zinc-100 text-md md:text-2xl brightness-30 ">
              Play Bot
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
