export const History = () => {
  return (
    <>
      <div className="p-3 h-full bg-zinc-700">
        <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900 justify-between">
          <div>
            <div className="font-serif flex flex-row text-zinc-200 bg-zinc-950 text-sm font-[500] p-2 gap-2 text-center ">
              <div className="flex-1"><img className="size-5 mx-auto" src="/media/timer.png" alt="" /></div>
              <div className="flex-5">Player</div>
              <div className="flex-2">Result</div>
              <div className="flex-3">Date</div>
              <div className="flex-1">Rematch</div>
            </div>
            <div className=" flex flex-row text-zinc-200 bg-zinc-800 text-sm font-[500] p-2 gap-2 text-center ">
              <div className="flex-1"><img className="size-5 mx-auto" src="/media/stopwatchG.png" alt="" /></div>
              <div className="flex-5">Broot</div>
              <div className="flex-2">won</div>
              <div className="flex-3">Yesterday</div>
              <div className="flex-1 bg-emerald-700 p-1 text-[10px]">Rematch</div>
            </div>
            <div className=" flex flex-row text-zinc-200 bg-zinc-800 text-sm font-[500] p-2 gap-2 text-center ">
              <div className="flex-1"><img className="size-5 mx-auto" src="/media/stopwatchG.png" alt="" /></div>
              <div className="flex-5">Bull</div>
              <div className="flex-2">won</div>
              <div className="flex-3">26-03-2025</div>
              <div className="flex-1  bg-emerald-700 p-1 text-[10px]">Rematch</div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center py-3 text-lg font-bold text-zinc-200 bg-zinc-500">
            <img
              className="size-6 justify-self-center mx-1"
              src="/media/history.png"
              alt=""
            />
            Game History
          </div>
        </div>
      </div>
    </>
  );
};
