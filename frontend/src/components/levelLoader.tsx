import { useUserContext } from "../hooks/contextHook";

export const LevelLoader = () => {
  const { Ratings, theme } = useUserContext();
  const rating = Ratings.rapid;

  const trophies = [
    { name: "legend", rating: 3000 },
    { name: "crown", rating: 2550 },
    { name: "platinum", rating: 2100 },
    { name: "diamond", rating: 1650 },
    { name: "gold", rating: 1200 },
    { name: "silver", rating: 750 },
    { name: "bronz", rating: 300 },
  ];

  const currentTrophy = trophies.find((t) => rating >= t.rating);
  const Ptg = currentTrophy&&currentTrophy.name!=="legend"
    ? Math.floor((1-(((currentTrophy.rating+450)-rating) / 450)) * 100)
    : 100;

  return (
    <div className={`flex flex-col h-fit w-full self-end p-5 px-4 md:p-6 my-3 ${theme?"bg-zinc-800 shadow-lg/50":"bg-zinc-950 shadow-lg/30"}   rounded-lg`}>
      <span className="text-zinc-300 text-[10px] md:text-[14px] flex items-center ">
        {currentTrophy && (
          <img
            src={`/media/${currentTrophy.name}.png`}
            alt={currentTrophy.name}
            className="size-4 md:size-6"
          />
        )}
        {rating}
      </span>
      <div className={`bg-zinc-200 h-2 rounded-full my-1`}>
        <div
          className="h-full rounded-full bg-emerald-600 "
          style={{ width: `${Ptg}%` }}
        ></div>
      </div>
    </div>
  );
};
