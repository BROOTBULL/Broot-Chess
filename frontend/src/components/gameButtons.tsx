import { useNavigate } from "react-router-dom";

export const GameButtons = () => {
    const navigate=useNavigate();

  return (
    <>
        <div className="flex flex-col h-fit gap-3 w-auto my-auto lg:w-[50%] ">
     <div className="bg-zinc-800 playButton h-18 hidden lg:flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50  ">
     <img
          className="size-6 m-1 "
          src="../../public/media/blitz.png"
          alt=""
        />
        <span className="font-serif text-zinc-100 text-lg md:text-2xl">
          Play Blitz
        </span>
      </div>
      <div
       className="bg-zinc-800 playButton h-18 flex flex-row items-center justify-center cursor-pointer px-4 shadow-md/50  "
       onClick={()=>navigate("/game")}>
        <img
          className="size-6 m-1 "
          src="../../public/media/pawn.png"
          alt=""
        />
        <span className="font-serif text-zinc-100 text-lg md:text-2xl">
          Play Online
        </span>
      </div>
      <div className="playOptions flex flex-row lg:flex-col gap-2.5  ">
        <div className="bg-zinc-800 playButton h-18 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-[50%] lg:w-full">
          <img
            className="size-7 m-1 mb-2"
            src="../../public/media/bot.png"
            alt=""
          />
          <span className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play Bot
          </span>
        </div>
        <div className="bg-zinc-800 playButton h-18 flex flex-row items-center justify-center cursor-pointer shadow-md/50 w-[50%] lg:w-full ">
          <img
            className="size-8 m-1 "
            src="../../public/media/friends.png"
            alt=""
          />
          <span className="font-serif text-zinc-100 text-lg md:text-2xl">
            Play a Friend
          </span>
        </div>
      </div>
    
      
    </div>
    </>
  );
};
