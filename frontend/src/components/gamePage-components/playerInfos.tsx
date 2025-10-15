import { useEffect, useRef, useState } from "react";
import { useChessContext } from "../../hooks/contextHook";
import { Rating } from "../../context/userProvider";

export const PlayerInfo = ({
  name,
  turn,
  rating,
  profile,
  playerColor,
}: {
  name: string;
  turn: boolean;
  rating: Rating;
  profile: string | null;
  playerColor: string;
}) => {
  const {
    gameEnded,
    moves,
    gameType,
    timers,
    MultiplayerGameStarted,
    playerWon,
  } = useChessContext();

  const displayName = name.length > 12 ? name.slice(0, -8) + "..." : name;

  const [gameTimer, setGameTimer] = useState(15 * 60);
  const [perMoveTimer, setPerMoveTimer] = useState(
    gameType !== "daily" ? 120 : 600
  );
  const [gameRating, setGameRating] = useState<number>(rating.rapid);
  const [won, setWon] = useState<boolean | "d" | undefined>(false);

  const gameTimerRef = useRef<number | undefined>(undefined);
  const perMoveTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (gameEnded && playerWon !== undefined) {
      if (playerWon === "Draw") setWon("d");
      else setWon(playerWon === name);
    } else {
      setWon(undefined);
    }
  }, [playerWon, name, gameEnded]);

  useEffect(() => {
    if (!MultiplayerGameStarted) {
      const initialTime =
        gameType === "blitz"
          ? 5 * 60
          : gameType === "rapid"
          ? 15 * 60
          : 60 * 60;
      setGameTimer(initialTime);
      setPerMoveTimer(gameType !== "daily" ? 120 : 600);
      setGameRating(
        gameType === "blitz"
          ? rating.blitz
          : gameType === "daily"
          ? rating.daily
          : rating.rapid
      );
    }
  }, [gameType, MultiplayerGameStarted, rating]);

  useEffect(() => {
    if (MultiplayerGameStarted) {
      const mainTime =
        playerColor === "w" ? timers.whiteTimeLeft : timers.blackTimeLeft;
      setGameTimer(Math.floor(mainTime / 1000));
      if (turn) setPerMoveTimer(Math.floor(timers.abandonedDeadline / 1000));
      else setPerMoveTimer(gameType !== "daily" ? 120 : 600);
    }
  }, [timers, MultiplayerGameStarted, playerColor, turn, gameType]);

  useEffect(() => {
    clearInterval(gameTimerRef.current);
    clearInterval(perMoveTimerRef.current);

    if (turn && moves.length && !gameEnded) {
      gameTimerRef.current = setInterval(() => {
        setGameTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);

      perMoveTimerRef.current = setInterval(() => {
        setPerMoveTimer((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }

    return () => {
      clearInterval(gameTimerRef.current);
      clearInterval(perMoveTimerRef.current);
    };
  }, [turn, gameEnded, moves.length]);

  function formatTimer(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
  return (
    <div className="h-14 m-1 p-1 flex items-center text-black w-full text-[13px]">
      <div className="size-10 ring-2 rounded-lg bg-black shadow-lg/40 overflow-hidden flex justify-center items-center">
        {profile && (
          <img className="size-10 self-center" src={profile} alt="profile" />
        )}
      </div>

      <div className="text-sm md:text-lg font-bold ml-2">
        {displayName}
        <div className="text-[10px] md:text-[12px] flex flex-row gap-2">
          <>{gameRating}</>{" "}
          <div
            className={`${
              won === undefined
                ? "hidden"
                : won === "d"
                ? "text-zinc-500"
                : won
                ? "text-green-600"
                : "text-rose-800"
            }`}
          >
            {won === "d" ? "+0" : won ? "+10" : "-10"}
          </div>
        </div>
      </div>

      <div
        className={`${
          turn && MultiplayerGameStarted
            ? "bg-emerald-900"
            : "bg-zinc-600 brightness-50"
        } ml-auto text-end ${
          gameTimer <= 60 && gameTimer % 2 === 0
            ? "text-rose-700"
            : "text-zinc-200"
        } text-sm font-[600] w-35 p-2 shadow-lg/40 rounded-md flex flex-row`}
      >
        <div
          className={`text-sm text-rose-400 px-0.5 ${
            perMoveTimer <= 60 ? "flex" : "hidden"
          }`}
        >
          {perMoveTimer.toString().padStart(2, "0")}
        </div>
        <div className="ml-auto">{formatTimer(gameTimer)}</div>
      </div>
    </div>
  );
};
