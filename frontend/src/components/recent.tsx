export const RecentGame = () => {

  function handleChallenge()
  {

  }

  return (
    <div className="w-full h-fit my-5 ring-1 ring-zinc-400">
      <div className="flex justify-between m-2 font-bold">
        <span className=" text-zinc-700 text-md lg:text-2xl cursor-default">
          Recent Matchs
        </span>
      </div>
      <div className="flex flex-row ring-1 ring-zinc-400 overflow-x-auto overflow-hidden scroll-smooth ">
        <div className="min-w-[290px] md:min-w-[360px] m-2 flex flex-row bg-zinc-400  shadow-md/50 p-2">
          <img
            className="size-35 md:size-45 drop-shadow-md mr-4"
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <div className="flex flex-col w-full">
            <span className="text-zinc-800 font-bold text-sm">
              Opponent (500)
            </span>
            <span className="text-sm text-zinc-600 font-[600]">
              <span className="text-green-700">11</span> /{" "}
              <span className="text-zinc-800">1</span> /{" "}
              <span className="text-red-700">2</span>
            </span>
            <div
              onClick={() => handleChallenge()}
              className="bg-emerald-600 hover:bg-emerald-500 duration-200 cursor-pointer w-fit p-2 shadow-md/30 flex self-end mt-auto items-center justify-center flex-row"
            >
              <span className="text-zinc-200 font-bold text-sm">Challenge</span>
            </div>
          </div>
        </div>
                <div className="min-w-[320px] md:min-w-[360px] m-2 flex flex-row bg-zinc-400  shadow-md/50 p-2">
          <img
            className="size-35 md:size-45 drop-shadow-md mr-4"
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <div className="flex flex-col w-full">
            <span className="text-zinc-800 font-bold text-sm">
              Opponent (500)
            </span>
            <span className="text-sm text-zinc-600 font-[600]">
              <span className="text-green-700">11</span> /{" "}
              <span className="text-zinc-800">1</span> /{" "}
              <span className="text-red-700">2</span>
            </span>
            <div
              onClick={() => handleChallenge()}
              className="bg-emerald-600 hover:bg-emerald-500 duration-200 cursor-pointer w-fit p-2 shadow-md/30 flex self-end mt-auto items-center justify-center flex-row"
            >
              <span className="text-zinc-200 font-bold text-sm">Challenge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


