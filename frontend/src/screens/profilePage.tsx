import { GameHistory } from "../components/gameHistory";
import { GameRatings } from "../components/gameRating";
import { Header2, Header3 } from "../components/header";
import { Profile2 } from "../components/profile";
import { Stats } from "../components/stats";
import { useUserContext } from "../hooks/contextHook";
import { Trasition } from "../transition";

const ProfilePage = () => {
  const { user,friends } = useUserContext();
  const rating = user?.rating ?? 0;

  const trophies = [
    { name: "legend", rating: 3000 },
    { name: "crown", rating: 2500 },
    { name: "platinum", rating: 2000 },
    { name: "diamond", rating: 1600 },
    { name: "gold", rating: 1100 },
    { name: "silver", rating: 700 },
    { name: "bronz", rating: 400 },
  ];
  const currentTrophy = trophies.find((t) => rating >= t.rating);

  const Ptg = currentTrophy
    ? Math.floor((currentTrophy.rating / rating) * 100)
    : 0;

  return (
    <>
      <div className=" flex w-full bg-gradient-to-r from-zinc-300 to-zinc-100 ">
        <Header2 />
        <Header3 />
        <div className="pt-20 flex flex-col mx-auto h-fit w-full p-3 md:p-6 md:pt-28 xl:pt-10 lg:pl-30 max-w-[1200px] ">
          <Profile2 />
          <div className="flex-col md:flex-row flex gap-2 ">
            <GameRatings />
            <div className="bg-zinc-800 h-48 w-full my-1 flex flex-row rounded">
              <div className="flex flex-col items-center">
                <img
                  className="size-30 m-5 mb-0"
                  src={`./media/${currentTrophy?.name}.png`}
                  alt=""
                />
                <div className="text-red-200 font-bold text-lg">
                  Bronze League
                </div>
              </div>
              <div className="rounded h-5 w-[60%] bg-zinc-400 mt-auto ml-auto mr-5 mb-7">
                <div
                  className="h-full rounded-full bg-emerald-500 "
                  style={{ width: `${Ptg}%` }}
                ></div>
              </div>
            </div>
          </div>
           <div className="text-zinc-800 font-bold text-lg m-2 mt-2 mb-0">
            Friends
           </div>
          <div className="bg-zinc-500 h-fit w-full mb-2 rounded-lg flex flex-row scroll-smooth overflow-x-auto">
           {friends.map((friend,i)=>{
            return(<div key={i}  className="flex flex-col items-center m-2 bg-black rounded-lg">
                <div className="aspact-square rounded-md border-3 border-black"><img className="size-26 rounded-lg" src={friend?.profile||"./media/chessboard.png"} alt="" />
                </div>
                <div className="text-zinc-200 font-bold text-sm">{friend.name}</div>
</div> )
           })}
          </div>
          <Stats />
          <GameHistory />
        </div>
      </div>
    </>
  );
};

export default Trasition(ProfilePage);
