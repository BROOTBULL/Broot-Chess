
import { useUserContext } from "../hooks/contextHook";
import { useSendNotification } from "../hooks/NotificationHook";

export const Friends = () => {
  const { friends } = useUserContext();
  const {sendNotification}=useSendNotification()

  return (
    <>
      <div className="p-3 h-full w-full bg-zinc-700 max-w-[1000px]">
        <div className="flex flex-col Profile h-full min-h-[500px] w-full bg-zinc-900">
          {friends && friends.length > 0 ? (
            friends.map((friend,i) => {
              return (
                <div key={i} className=" flex flex-row items-center text-zinc-200 bg-zinc-800 text-sm font-[500] p-2 gap-2 text-center ">
                  <img
                    className="size-5"
                    src="/media/socialW.png"
                    alt=""
                  />
                  {friend.username}
                  <div 
                  onClick={()=>sendNotification(friend.id,"CHALLENGE","Challenged you for a friendly Rapid Match")}
                  className="ml-auto bg-emerald-900 p-2 text-[10px] cursor-pointer hover:bg-emerald-800 rounded">
                    Challenge
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-white my-auto text-md">No friends yet</div>
          )}
        </div>
      </div>
    </>
  );
};
