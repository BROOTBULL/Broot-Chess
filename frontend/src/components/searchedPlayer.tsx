import axios from "axios";
import { useUserContext } from "../hooks/contextHook";
import { useEffect, useState } from "react";
import { Player } from "../screens/socials";
import { useSendNotification } from "../hooks/NotificationHook";
export type Status =
  | "Request_Sent"
  | "friends"
  | "Request_Received"
  | "Friend_Request"; // we are talking about player who recieved our req   ...so on behave of his prospective he recieved req or sent req

export const SearchedPlayer = ({ player }: { player: Player }) => {
  const { user } = useUserContext();
  const [status, setStatus] = useState<Status>("Friend_Request");
  const {sendNotification}=useSendNotification()

  useEffect(()=>{
    if (player.sentRequests.length > 0) {
    setStatus(player.sentRequests[0].status === "PENDING" ? "Request_Received" : "friends");
    } else if (player.receivedRequests.length > 0) {
    setStatus(player.receivedRequests[0].status === "PENDING" ? "Request_Sent" : "friends");
    }
  },[])

  if(status==="Request_Received")
    return(<div 
            onClick={()=>handleRequest(player,status)}
            className="bg-emerald-900 p-2 text-white text-[12px] m-1 rounded-sm cursor-pointer hover:bg-emerald-800 duration-200">
            Accept
          </div>)

          

  async function handleRequest(player:Player, status: Status) {
    if (status === "Request_Sent" || status === "friends") return;
    const response = await axios.post("/social/reqPlayer", {
      senderId: user?.id,
      receiverId: player.id,
    });

    const reqtype=(status==="Friend_Request")?"Sent":"Accepted your"
    const responseReqMessage = await axios.post("/social/message", {
        message: reqtype+" Friend Request",
        user: user,
        friendId: player.id,
        type: (reqtype==="Sent")?"REQUEST":"ACCEPT",
      });
    console.log(player);
    const sentmessageId=responseReqMessage.data.sentMessage.id;
    sendNotification(player.id,(status==="Friend_Request")?"REQUEST":"ACCEPT",(status==="Friend_Request")?sentmessageId:"Accepted your friend request")//message id is sent to notification so that if user accepted the req via notification then we can delete message sent with this id
    console.log(response.data.message," ",responseReqMessage.data.message);
    setStatus(response.data.status)
  }
  return (
    <div
      onClick={() => {
        handleRequest(player, status)
      }}
      className={`hover:bg-zinc-700 cursor-pointer p-1 interact-btn rounded-md flex justify-center duration-200 `}
    >
      <img
        className={`size-8 ${status === "Request_Sent" ? "brightness-50" : ""}`}
        src={`./media/${status}.png`}
        alt=""
      />
      <div className="bg-zinc-700 absolute text-[11px] p-1 text-zinc-300 opacity-0 rounded-sm interact mt-10 duration-200 transition-opacity delay-200">
        {status}
      </div>
    </div>
  );
};
