import { AnimatePresence,motion } from "motion/react"
import { useChessContext, useUserContext } from "../hooks/contextHook"
import { REQUEST_DRAW_APPROVE } from "../context/ContextProvider"

export const DrawRequest=()=>{
    const {socket}=useUserContext()
    const {Opponent,drawRequested,setDrawRequested,roomId}=useChessContext()

  function handleDrawReq(choice: boolean) {
    console.log("roomId", roomId);
    socket?.send(
      JSON.stringify({
        type: REQUEST_DRAW_APPROVE,
        payload: {
          gameId: roomId,
          choice: choice,
        },
      })
    );
  }
    function handleClose()
    {
     setDrawRequested(false)
    }
    return(
         <AnimatePresence>
              {drawRequested && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute w-[82%] aspect-square z-50 rounded-lg p-1 justify-center items-center flex`}
                >
                  <div
                    className={`w-60 h-40 z-50 flex bg-zinc-800 rounded-lg p-1 flex-col `}
                  >
                    <div className="text-2xl text-zinc-200 font-bold mt-5 text-center flex flex-col justify-center items-center">
                      Draw Proposed
                      <div className="text-[12px] text-zinc-400 font-bold w-[60%] text-center mt-1">
                        {Opponent?.name} has offered a draw
                      </div>
                    </div>

                    <img
                      onClick={handleClose}
                      className="absolute size-7 flex z-50 self-end rotate-45 invert cursor-pointer hover:drop-shadow-[0px_0px_2px] hover:drop-shadow-zinc-500"
                      src="./media/closeOption.png"
                      alt=""
                    />

                    <div className=" w-[80%] flex mx-auto justify-center  ">
                      <div
                        onClick={() => handleDrawReq(true)}
                        className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-emerald-900 playButton cursor-pointer flex-1"
                      >
                        Accept
                      </div>
                      <div
                        onClick={() => handleDrawReq(false)}
                        className="text-sm text-zinc-200 font-bold p-2 m-3 rounded-md text-center bg-zinc-700 cursor-pointer flex-1"
                      >
                        Reject
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
    )
}