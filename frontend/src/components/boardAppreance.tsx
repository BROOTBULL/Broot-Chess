import { AnimatePresence, motion } from "motion/react";
import { useChessContext } from "../hooks/contextHook";

export const BoardAppreance = ({
  theme,
  setTheme,
}: {
  theme: boolean;
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
}) => {


  const {setBoardAppearnce,boardAppearnce}=useChessContext()  

  function handleClose() {
    setTheme(false);
  }
  function handleChangeColor(theme:string)
  {
    setBoardAppearnce(theme)
  }
  function handleSaveTheme()
  {
    localStorage.setItem("theme",boardAppearnce)
    setTheme(false)
  }

  return (
    <AnimatePresence>
      {theme && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`absolute w-[82%] aspect-square z-50 rounded-lg p-1 justify-center items-center flex`}
        >
          <div
            className={`w-80 h-fit z-50 flex bg-zinc-800 rounded-lg p-1 flex-col`}
          >
            <div className="text-xl text-zinc-200 font-bold mt-3 text-center flex flex-col justify-center items-center mb-5">
              Board Appreance
            </div>
            <img
              onClick={handleClose}
              className="absolute size-7 flex z-50 self-end rotate-45 invert cursor-pointer hover:drop-shadow-[0px_0px_2px] hover:drop-shadow-zinc-500"
              src="./media/closeOption.png"
              alt=""
            />

            <div className="h-full w-full px-5 flex flex-wrap justify-around gap-1">
              <button 
              onClick={()=>handleChangeColor("zinc")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Zinc</div>
                <div className="ml-auto bg-zinc-200 rounded size-6 border-2 border-black"></div>
                <div className="bg-zinc-600 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={()=>handleChangeColor("wooden")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Wooden</div>
                <div className="ml-auto bg-yellow-100 rounded size-6 border-2 border-black"></div>
                <div className="bg-orange-900/30 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={()=>handleChangeColor("forest")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Forest</div>
                <div className="ml-auto bg-green-200 rounded size-6 border-2 border-black"></div>
                <div className="bg-emerald-600/50 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={()=>handleChangeColor("ocean")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Ocean</div>
                <div className="ml-auto bg-blue-200 rounded size-6 border-2 border-black"></div>
                <div className="bg-indigo-900/30 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={()=>handleChangeColor("night")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Night</div>
                <div className="ml-auto bg-rose-200 rounded size-6 border-2 border-black"></div>
                <div className="bg-purple-900/30 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={()=>handleChangeColor("sakura")}
              className=" p-2 flex flex-row flex-1 rounded gap-1 text-zinc-200 bg-zinc-600/20 cursor-pointer hover:bg-zinc-600">
                <div className="font-bold text-md ">Sakura</div>
                <div className="ml-auto bg-rose-200 rounded size-6 border-2 border-black"></div>
                <div className="bg-pink-900/60 rounded size-6 border-2 border-white"></div>
              </button>
              <button 
              onClick={handleSaveTheme}
              className="bg-emerald-800 px-3 py-1 rounded mx-auto m-2 text-zinc-200 cursor-pointer font-bold hover:bg-emerald-700">Apply</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
