export const FriendsGame = () => {
  function handleChallenge() {}
  return (
    <div className="lg:w-[50%] w-full h-fit my-4 ring-1 ring-zinc-400">
      <div className="flex justify-between m-2 my-1 font-bold">
        <span className=" text-zinc-700 text-md lg:text-2xl cursor-default">
          Friends
        </span>
        <span className=" text-zinc-700 text-md lg:text-2xl ml-auto cursor-pointer">
          See all
        </span>
      </div>
      <div className={`flex flex-row ring-1 md:gap-1 ring-zinc-400 overflow-x-auto custom-scroll-w overflow-hidden scroll-smooth `}>
        <div className="min-w-[120px] md:min-w-[180px] flex flex-col bg-zinc-400 items-center shadow-md/50 p-2 m-2">
          <img
            className="size-15 md:size-45 drop-shadow-md "
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <span className="text-zinc-800 font-[500] text-[13px]">
            Opponent (500)
          </span>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">11</span> /{" "}
            <span className="text-zinc-800">1</span> /{" "}
            <span className="text-red-700">2</span>
          </span>
          <div
            onClick={() => handleChallenge()}
            className="bg-zinc-700 w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md">
              Challenge
            </span>
          </div>
        </div>
        <div className="min-w-[120px] md:min-w-[180px] flex flex-col bg-zinc-400 items-center shadow-md/50 p-2 m-2">
          <img
            className="size-15 md:size-45 drop-shadow-md "
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <span className="text-zinc-800 font-[500] text-[13px]">
            Opponent (500)
          </span>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">11</span> /{" "}
            <span className="text-zinc-800">1</span> /{" "}
            <span className="text-red-700">2</span>
          </span>
          <div
            onClick={() => handleChallenge()}
            className="bg-zinc-700 w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md">
              Challenge
            </span>
          </div>
        </div>

        <div className="min-w-[120px] md:min-w-[180px] flex flex-col bg-zinc-400 items-center shadow-md/50 p-2 m-2">
          <img
            className="size-15 md:size-45 drop-shadow-md "
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <span className="text-zinc-800 font-[500] text-[13px]">
            Opponent (500)
          </span>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">11</span> /{" "}
            <span className="text-zinc-800">1</span> /{" "}
            <span className="text-red-700">2</span>
          </span>
          <div
            onClick={() => handleChallenge()}
            className="bg-zinc-700 w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md">
              Challenge
            </span>
          </div>
        </div>
        <div className="min-w-[120px] md:min-w-[180px] flex flex-col bg-zinc-400 items-center shadow-md/50 p-2 m-2">
          <img
            className="size-15 md:size-45 drop-shadow-md "
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <span className="text-zinc-800 font-[500] text-[13px]">
            Opponent (500)
          </span>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">11</span> /{" "}
            <span className="text-zinc-800">1</span> /{" "}
            <span className="text-red-700">2</span>
          </span>
          <div
            onClick={() => handleChallenge()}
            className="bg-zinc-700 w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md">
              Challenge
            </span>
          </div>
        </div>
        <div className="min-w-[120px] md:min-w-[180px] flex flex-col bg-zinc-400 items-center shadow-md/50 p-2 m-2">
          <img
            className="size-15 md:size-45 drop-shadow-md "
            src="/media/chessboard.png" // Use public path in React
            alt="chess"
          />
          <span className="text-zinc-800 font-[500] text-[13px]">
            Opponent (500)
          </span>
          <span className="text-sm text-zinc-600 font-[600]">
            <span className="text-green-700">11</span> /{" "}
            <span className="text-zinc-800">1</span> /{" "}
            <span className="text-red-700">2</span>
          </span>
          <div
            onClick={() => handleChallenge()}
            className="bg-zinc-700 w-fit p-2 md:p-3 shadow-md/30 flex flex-row cursor-pointer playButton"
          >
            <span className="text-zinc-200 font-bold text-sm md:text-md">
              Challenge
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
