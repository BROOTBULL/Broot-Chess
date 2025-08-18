import { useEffect, useState } from "react";
import { GameHistory } from "../components/gameHistory";
import { GameRatings } from "../components/gameRating";
import { Header2, Header3 } from "../components/header";
import { Profile2 } from "../components/profile";
import { Stats } from "../components/stats";
import { useUserContext } from "../hooks/contextHook";
import { Trasition } from "../transition";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GamesData, User } from "../context/userProvider";
import { LandingLoader } from "../assets/loader";

const ProfilePage = () => {
  const { theme } = useUserContext();
  const playerId = useParams();

  const [Player, setPlayer] = useState<User>();
  const [friends, setFriends] = useState<User[] | []>([]);
  const [games, setGames] = useState<GamesData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerId) return;

    const getPlayer = async () => {
      const response = await axios.get("/social/player", {
        params: { playerId: playerId.playerId },
      });
      setPlayer(response.data.player);
    };

    const getFriends = async () => {
      const response = await axios.get("/social/friends", {
        params: { userId: playerId.playerId },
      });
      setFriends(response.data.Friends);
    };
    const getGames = async () => {
      const response = await axios.get("/gameData/games", {
        params: { userId: playerId.playerId },
      });
      setGames(response.data.games);
    };
    getPlayer();
    getFriends();
    getGames();
  }, []);

  type CurrentTrophy={
    name:string,rating:number
  }

  const trophies = [
    { name: "legend", rating: 3000 },
    { name: "crown", rating: 2500 },
    { name: "platinum", rating: 2000 },
    { name: "diamond", rating: 1600 },
    { name: "gold", rating: 1100 },
    { name: "silver", rating: 700 },
    { name: "bronz", rating: 400 },
  ];


  const calulatePtg=(rating:number):number =>{
  const currentTrophy = trophies.find((t) => rating >= t.rating) as CurrentTrophy
    return currentTrophy && currentTrophy.name !== "legend"
      ? Math.floor((1 - (currentTrophy.rating + 450 - rating) / 450) * 100)
      : 100;
}

const currentTrophyName=(rating:number):string=>{
    const currentTrophy = trophies.find((t) => rating >= t.rating) as CurrentTrophy
    return currentTrophy.name
}
  if (!Player) {
    return <LandingLoader />; // Replace with spinner or splash screen
  }

  return (
    <>
      <div
        className={` flex w-full bg-gradient-to-r ${
          theme ? " from-zinc-300 to-zinc-100 " : " from-zinc-800 to-zinc-900 "
        } `}
      >
        <Header2 />
        <Header3 />
        <div className="pt-20 flex flex-col mx-auto h-fit w-full p-3 md:p-6 md:pl-25 md:pt-28 xl:pt-10 lg:pl-35 max-w-[1200px] ">
          <Profile2 player={Player as User} />
          <div className="flex-col sm:flex-row flex gap-2 ">
            <GameRatings Ratings={Player.rating} />
            <div
              className={`${
                theme
                  ? "bg-zinc-800"
                  : " bg-zinc-950 shadow-zinc-800 shadow-lg "
              } h-38 lg:h-48 w-full my-1 flex flex-row rounded-lg px-2`}
            >
              <div className="flex flex-col justify-around w-full py-2">
                <div className="flex flex-col w-full justify-end">
                  <div className="text-[12px] md:text-sm md:my-1 font-bold text-zinc-200 flex flex-row">
                    <img className="size-5" src="/media/blitz.png" alt="" />
                    Blitz{" :"}
                    <div className="text-emerald-300 ml-1 flex flex-row items-center">
                      {Player.rating.blitz}
                      <img className="size-5" src={`/media/${currentTrophyName(Player.rating.blitz)}.png`} />
                    </div>
                  </div>
                  <div className="rounded-full h-2 lg:h-3 w-full bg-linear-to-b from-zinc-200 to-zinc-300">
                    <div
                      className="h-full rounded-full bg-linear-to-bl from-emerald-500 to-emerald-600 "
                      style={{ width: `${calulatePtg(Player.rating.blitz)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-end">
                  <div className="text-[12px] md:text-sm md:my-1 font-bold text-zinc-200 flex flex-row">
                    <img className="size-5" src="/media/rapid.png" alt="" />
                    Rapid{" :"}
                    <div className="text-emerald-300 ml-1 flex flex-row items-center">
                      {Player.rating.rapid}
                      <img className="size-5" src={`/media/${currentTrophyName(Player.rating.rapid)}.png`} />
                    </div>
                  </div>
                  <div className="rounded-full h-2 lg:h-3 w-full bg-linear-to-b from-zinc-200 to-zinc-300">
                    <div
                      className="h-full rounded-full bg-linear-to-bl from-emerald-500 to-emerald-600 "
                      style={{ width: `${calulatePtg(Player.rating.rapid)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col w-full justify-end">
                  <div className="text-[12px] md:text-sm md:my-1 font-bold text-zinc-200 flex flex-row">
                    <img className="size-5" src="/media/classical.png" alt="" />
                    Daily{" :"}
                    <div className="text-emerald-300 ml-1 flex flex-row items-center">
                      {Player.rating.daily}
                      <img className="size-5" src={`/media/${currentTrophyName(Player.rating.daily)}.png`} />
                    </div>
                  </div>
                  <div className="rounded-full h-2 lg:h-3 w-full bg-linear-to-b from-zinc-200 to-zinc-300">
                    <div
                      className="h-full rounded-full bg-linear-to-bl from-emerald-500 to-emerald-600 "
                      style={{ width: `${calulatePtg(Player.rating.daily)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-zinc-800 font-bold text-lg m-2 mt-2 mb-0 scroll-smooth overflow-x-auto custom-scroll">
            Friends
          </div>
          {friends.length ? (
            <div className="bg-zinc-500 h-fit w-full mb-2 rounded-lg flex flex-row scroll-smooth overflow-x-auto">
              {friends.map((friend, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => navigate(`/profile/${friend?.id}`)}
                    className="flex flex-col items-center m-2 w-27 bg-black rounded-lg cursor-pointer hover:drop-shadow-md hover:drop-shadow-zinc-200"
                  >
                    <div className="aspact-square rounded-md border-3 border-black">
                      <img
                        className="size-26 rounded-sm"
                        src={friend?.profile || "/media/chessboard.png"}
                        alt=""
                      />
                    </div>
                    <div className="text-zinc-200 font-bold text-sm">
                      {friend.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-500 h-36 w-full mb-2 rounded-lg flex justify-center items-center">
              <div>No Friends</div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-5 w-full pb-80 ">
            <GameHistory games={games} />
            <Stats Ratings={Player.rating} games={games} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Trasition(ProfilePage);
