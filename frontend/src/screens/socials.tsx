import { useState } from "react";
import { Header2, Header3 } from "../components/header";

import { Profile } from "../components/profile";

import { Trasition } from "../transition";

export type Player={
    name:string,
    profile:string,
    username:string
}

const Socials = () => {

    const [search,setSearch]=useState("");
    const [seachedPlayer,setShearchedPlayer]=useState<User>()

    async function handleSearch(e)
    {
        e.preventDefault();
        const 
        setSearch("");

    }
  return (
    <>
      <div className=" flex w-full bg-gradient-to-r from-zinc-300 to-zinc-100">
        <Header2 />
        <Header3 />
        <div className="pt-20 flex flex-col mx-auto h-fit w-full p-3 md:p-6 md:pt-28 xl:pt-10 lg:pl-30 max-w-[1200px] ">
          <Profile />
          <div className=" h-fir w-full p-2 px-5 mt-5">
            <div className="text-2xl font-bold py-3 text-zinc-900 ">
              Messages
            </div>
            <div className="text-lg text-zinc-800  min-h-60 flex flex-col rounded-sm">
              <div className="mx-auto my-5">No message recieved yet</div>
    {/* <div className="bg-zinc-800 w-full h-fit border-2 border-b-0 border-zinc-700 flex flex-row p-3 ">
                <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full"><img className="size-18" src="./media/userW.png" alt="" /></div>
                <div className="flex flex-col w-fit max-w-[80%] pl-3 justify-center ">
                <div className="text-md text-zinc-200">Broot</div>
                <div className="text-zinc-300 text-sm"> Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 </div>
                </div> 
                <div className="flex justify-end items-center w-[20%] ml-auto gap-3">
                <div className="text-sm">Reply</div>
                <div className="bg-emerald-900 text-white p-2 px-5 rounded-sm">Accept</div>
                <div className="bg-zinc-700 rounded-sm p-2 "><img className="rotate-45 size-7" src="./media/plus.png" alt="" /></div>
                </div>             
    </div> */}
    {/* <div className="bg-zinc-800 w-full h-fit border-2 border-zinc-700 flex flex-row p-3 ">
                <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full"><img className="size-18" src="./media/userW.png" alt="" /></div>
                <div className="flex flex-col w-fit max-w-[80%] pl-3 justify-center ">
                <div className="text-md text-zinc-200">Broot</div>
                <div className="text-zinc-300 text-sm"> Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 Broot_Bull@123 </div>
                </div> 
                <div className="flex justify-end items-center w-[20%] ml-auto gap-3">
                <div className="text-sm mx-10">Reply</div>
                </div>             
    </div> */}
             
            </div>
          </div>
          <div className="w-full flex flex-col p-2 px-5 my-5">
            <div className="text-2xl font-bold py-3 text-zinc-900 ">
              Friends List
            </div>
            <form className="w-full h-10  rounded-sm border-2 border-zinc-400 flex justify-center ">
              <input
                className="w-[95%] h-full flex-15 outline-0 focus:border-zinc-600 rounded-l-sm focus:border-2 text-zinc-800 p-1 pl-2"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                type="text"
                placeholder="Search PlayerID or Username here"

              />
              <button 
              onClick={(e)=>handleSearch(e)}
              className="border-l-2 border-zinc-400 w-full h-full flex-1 flex justify-center items-center text-zinc-600 cursor-pointer hover:bg-zinc-400">
                <img
                  className="size-7 brightness-30"
                  src="./media/search.png"
                  alt=""
                />
              </button>
            </form>
            <div className="text-lg text-zinc-800 min-h-30 h-120 w-full flex justify-center mt-3 rounded-sm">
              <div className="m-5">No Friends yet</div>
              {/* <div className="bg-zinc-800 w-full h-30 border-2 border-zinc-700 flex flex-row p-3">
                 <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full"><img src="./media/userW.png" alt="" /></div>
                 <div className="w-fit h-full flex flex-col justify-center p-3"><div className="text-lg text-zinc-200">Broot</div><div className="text-zinc-300 text-sm">Broot_Bull@123</div></div>
                <div className="flex flex-row justify-center items-center ml-auto">
                <div><img className="size-8"src="./media/game.png" alt="" /></div>
                <div><img className="size-8"src="./media/message.png" alt="" /></div>
                <div><img className="size-8"src="./media/optionD.png" alt="" /></div>
              </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trasition(Socials);
