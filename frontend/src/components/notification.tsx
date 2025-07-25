import { useNavigate } from "react-router-dom";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import { Message } from "../screens/socials";
import axios from "axios";

const JOINROOM = "joinroom";

export const NotifMessage = ({ notif }: { notif: Message }) => {
  return (
    <div className="bg-zinc-800 w-full h-fit border-2 border-b-0 border-zinc-700 flex flex-row p-3 ">
      <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full">
        <img
          className="size-18"
          src={notif.sender.profile || "./media/userW.png"}
          alt=""
        />
      </div>
      <div className="flex flex-col w-fit max-w-[80%] pl-3 justify-center ">
        <div className="text-md text-zinc-200">{notif.sender.username}</div>
        <div className="text-zinc-300 text-sm">{notif.message}</div>
      </div>
      <div className="flex justify-end items-center w-[20%] ml-auto gap-3">
        <div className="text-sm mx-10 text-zinc-400 cursor-pointer hover:text-zinc-200">
          Reply
        </div>
      </div>
    </div>
  );
};

export const NotifChallenge = ({ notif }: { notif: Message }) => {
  const {socket}=useUserContext()
  const { setConnecting } = useChessContext();
  const navigate = useNavigate();

  function handleAccept() {
    if (notif.message)
      socket?.send(
        JSON.stringify({
          type: JOINROOM,
          payload: {
            roomId: notif.message,
          },
        })
      );
    setConnecting(true);
    navigate("/game");
  }

  return (
    <div className="bg-zinc-800 w-full h-fit border-2 border-b-0 border-zinc-700 flex flex-row p-3 ">
      <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full">
        <img
          className="size-18"
          src={notif.sender.profile || "./media/userW.png"}
          alt=""
        />
      </div>
      <div className="flex flex-col w-fit max-w-[80%] pl-3 justify-center ">
        <div className="text-md text-zinc-200">{notif.sender.username}</div>
        <div className="text-zinc-300 text-sm">Challenge</div>
      </div>
      <div className="flex justify-end items-center w-[20%] ml-auto gap-3">
        <div
          onClick={handleAccept}
          className="text-sm text-zinc-100 bg-emerald-800 rounded-sm p-2 px-4 cursor-pointer hover:bg-emerald-700"
        >
          Accept
        </div>
        <div className="bg-zinc-700 rounded-sm">
          <img className="size-9 p-1 rotate-45" src="./media/plus.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export const Notification = ({ setNotifications, notif }: {setNotifications:React.Dispatch<React.SetStateAction<Message[]>>, notif: Message }) => {
  const { user } = useUserContext();

  async function handleAccept(playerId: string) {
    const responseReq = await axios.post("/social/reqPlayer", {
      senderId: user?.id,
      receiverId: playerId,
    });
    const responseReqMessage = await axios.post("/social/message", {
      message: "Accepted your Friend Request",
      user: user,
      friendId: playerId,
      type: "ACCEPT",
    });
    console.log(responseReq.data.message, " ", responseReqMessage.data.message);
    handleClose(notif.id)
  }

  async function handleClose(id:string) {
    const responseDeleteMessage = await axios.post("/social/deletemessage", {
      messageId:id
    });
    console.log(responseDeleteMessage);
    setNotifications((prevMessages) =>
    prevMessages.filter((message) => message.id !== id)
  );
  }
  

  function renderBox() {
    switch (notif.messageType) {
      case "MESSAGE":
        return <div className="ml-auto ">            
          <div 
            onClick={()=>handleClose(notif.id)}
            className="rounded-sm cursor-pointer">
              <img
                className="size-5 rotate-45"
                src="./media/plus.png"
                alt=""
              />
            </div></div>;
      case "REQUEST":
        return (
          <div className="flex justify-end items-center w-[20%] ml-auto gap-3">
            <div
              onClick={() => handleAccept(notif.senderId)}
              className="text-sm text-zinc-100 bg-emerald-800 rounded-sm p-2 px-4 cursor-pointer hover:bg-emerald-700"
            >
              Accept
            </div>
            <div 
            onClick={()=>handleClose(notif.id)}
            className="bg-zinc-700 rounded-sm cursor-pointer hover:bg-rose-950">
              <img
                className="size-9 p-1 rotate-45"
                src="./media/plus.png"
                alt=""
              />
            </div>
          </div>
        )
        case "ACCEPT":
        return( <div className="ml-auto ">            
          <div 
            onClick={()=>handleClose(notif.id)}
            className="rounded-sm cursor-pointer">
              <img
                className="size-5 rotate-45"
                src="./media/plus.png"
                alt=""
              />
            </div></div>)
    }
  }

  return (
    <div className="bg-zinc-800 w-full h-fit border-2 border-b-0 border-zinc-700 flex flex-row p-3 ">
      <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full">
        <img
          className="size-18"
          src={notif.sender.profile || "./media/userW.png"}
          alt=""
        />
      </div>
      <div className="flex flex-col w-fit max-w-[80%] pl-3 justify-center ">
        <div className="text-md text-zinc-200">{notif.sender.username}</div>
        <div className="text-zinc-300 text-sm">{notif.message}</div>
      </div>
      {renderBox()}
    </div>
  );
};
