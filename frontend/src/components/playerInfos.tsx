import { useEffect, useRef, useState } from "react";
import { useChessContext } from "../hooks/contextHook";

export const PlayerInfo = ({
  userName,
  turn,
  rating,
  profile,
  playerColor
}: {
  userName: string;
  turn: boolean;
  rating: number;
  profile: string | null;
  playerColor:string
}) => {
  if (userName.length > 12) {
    userName = userName.slice(0, -8) + "...";
  }

  const gameTimerRef = useRef<number | undefined>(undefined);
  const perMoveTimerRef = useRef<number | undefined>(undefined);

  const { gameEnded ,moves,gameType,timers,gameStarted} = useChessContext();
  const [gameTimer, setGameTimer] = useState(15* 60);
  const [perMoveTimer, setPerMoveTimer] = useState(60);

useEffect(() => {
  const newTime =
    gameType === "blitz" ? 5*60 :
    gameType === "rapid" ? 15*60 :
    60*60;
  setGameTimer(newTime);
}, [gameType]);

useEffect(()=>{
  if(gameStarted&&turn&&playerColor)
  { 
    setGameTimer(Math.floor((playerColor==="w"?timers.whiteTimeLeft:timers.blackTimeLeft)/1000))
    console.log("On socket change test ....///");
  }
},[turn,gameStarted,playerColor,timers])

useEffect(()=>{ 
    setPerMoveTimer(Math.floor(timers.abandonedDeadline/1000))
    setGameTimer(Math.floor((playerColor==="w"?timers.whiteTimeLeft:timers.blackTimeLeft)/1000))
    console.log("On socket change:",timers);
},[timers])

useEffect(() => {
  clearInterval(gameTimerRef.current);
  if (turn && moves.length && !gameEnded) {
    gameTimerRef.current = setInterval(() => {
      setGameTimer(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
  }
  if (gameEnded) setGameTimer(15 * 60);
  return () => clearInterval(gameTimerRef.current);
}, [turn, gameEnded, moves.length]);

useEffect(() => {
  clearInterval(perMoveTimerRef.current);
  if (turn && moves.length && !gameEnded) {
    perMoveTimerRef.current = setInterval(() => {
      setPerMoveTimer(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
  }
  if (gameEnded) setPerMoveTimer(60);
  return () =>{ clearInterval(perMoveTimerRef.current)
     setPerMoveTimer(60)};
}, [turn, gameEnded, moves.length]);



  function formatedTimer(gameTimer: number) {
    const m = Math.floor(gameTimer / 60)
      .toString()
      .padStart(2, "0");
    const s = (gameTimer % 60).toString().padStart(2, "0");
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
            turn&&gameStarted ? " bg-emerald-900 " : " bg-zinc-600 brightness-50 "
          } ml-auto text-end ${
            gameTimer <= 20 && gameTimer % 2 == 0 ? "text-rose-700" : "text-zinc-200"
          } text-sm font-[600] w-35 p-2 shadow-lg/40 rounded-md flex flex-row`}
        >
          <div className={`text-sm text-rose-400 px-0.5 ${perMoveTimer<=20?"flex":"hidden"}`}>{perMoveTimer.toString().padStart(2, "0")}</div>
          <div className=" ml-auto">{formatedTimer(gameTimer)}</div>
        </div>
      </div>
    </>
  );
};
