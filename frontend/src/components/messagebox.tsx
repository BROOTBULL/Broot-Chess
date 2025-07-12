export const MessageBox=()=>{
    return(<><div className="flex flex-row items-center   bg-radial-[at_50%_50%] from-zinc-900 to-zinc-950 to-85%   text-sm font-[500] h-60 ">
          <form className="flex flex-row items-center bg-zinc-800 font-[500] w-full  mt-auto p-1">
                 <input 
                 placeholder="Type message here ..."
                 className="rounded-2xl w-[80%] h-9 mx-1 flex items-center p-2 text-zinc-200 outline-0 focus:border-zinc-500 border-2 border-zinc-700" />
                 <img className="bg-zinc-700 rounded-full p-2 size-9 ml-auto  " src="./media/send.png" alt="" />
          </form>
          </div>
    </>)
}