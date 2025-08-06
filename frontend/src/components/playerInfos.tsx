
export const PlayerInfo=({userName,color,rating,profile}:{userName:string,color:string,rating:number,profile:string|null})=>{

    if(userName.length>12)
    {
      userName=userName.slice(0,-8)
    }

    return(
        <>
           <div className="h-14 m-1 p-1 flex items-center text-black w-full text-[13px]">
            <div className="size-10 ring-2 rounded-lg bg-black shadow-lg/40 overflow-hidden flex justify-center items-center"><img className="size-10 self-center" src={profile!} alt="" /></div>
            <div className="text-sm md:text-lg font-bold ml-2">
             {userName}<div className=" text-[8px] md:text-[10px]">{rating}</div>
            </div>
            <div className={`${color==="w"?"bg-white":"bg-black"} ml-auto text-end text-white text-sm font-[600] w-40 p-2 shadow-lg/40`}>
              00:00
            </div>
          </div>
        </>
    )
}