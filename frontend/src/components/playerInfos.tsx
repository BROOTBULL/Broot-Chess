import { useEffect, useRef, useState } from "react";
import { useChessContext } from "../hooks/contextHook";

export const PlayerInfo = ({
  userName,
  turn,
  rating,
  profile,
}: {
  userName: string;
  turn: boolean;
  rating: number;
  profile: string | null;
}) => {
  if (userName.length > 12) {
    userName = userName.slice(0, -8) + "...";
  }

  const intervalRef = useRef<number | undefined>(undefined);
  const { gameEnded ,moves,gameType} = useChessContext();
  const [timer, setTimer] = useState(15* 60);

  useEffect(() => {
  const newTime =
    gameType === "blitz" ? 5*60 :
    gameType === "rapid" ? 15*60 :
    60*60;
  setTimer(newTime);
}, [gameType]);


  useEffect(() => {
    if (turn&&moves.length&&!gameEnded) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    if (gameEnded){ 
      clearInterval(intervalRef.current)
      setTimer(15*60)
    };
    return () => clearInterval(intervalRef.current);

  }, [turn,gameEnded,moves.length]);

  function formatedTimer(timer: number) {
    const m = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const s = (timer % 60).toString().padStart(2, "0");

    return `${m}:${s}`;
  }

  return (
    <>
      <div className="h-14 m-1 p-1 flex items-center text-black w-full text-[13px]">
        <div className="size-10 ring-2 rounded-lg bg-black shadow-lg/40 overflow-hidden flex justify-center items-center">
          <img className="size-10 self-center" src={profile!} alt="" />
        </div>
        <div className="text-sm md:text-lg font-bold ml-2">
          {userName}
          <div className=" text-[8px] md:text-[10px]">{rating}</div>
        </div>
        <div
          className={`${
            turn ? " bg-zinc-950 " : " bg-zinc-700 brightness-50 "
          } ml-auto text-end ${
            timer <= 20 && timer % 2 == 0 ? "text-rose-700" : "text-zinc-200"
          } text-sm font-[600] w-30 p-2 shadow-lg/40 rounded-md `}
        >
          {formatedTimer(timer)}
        </div>
      </div>
    </>
  );
};
