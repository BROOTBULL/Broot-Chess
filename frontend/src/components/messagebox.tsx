import {useState } from "react";
import { useChessContext } from "../hooks/contextHook";

export const MessageBox = () => {
  const sent = "sent";
  const CHAT = "chat";

  const [text, setText] = useState("");
  const { roomId ,socket,Messages} = useChessContext();

  function handleSend(e) {
    e.preventDefault();
    const message = { type: sent, message: text };
    socket?.send(
      JSON.stringify({
        type: CHAT,
        payload: {
          roomId: roomId,
          message: message,
        },
      })
    );
    setText("");
  }

  return (
    <>
    {console.log()
    }
      <div className="flex flex-col items-center   bg-radial-[at_50%_50%] from-zinc-900 to-zinc-950 to-85%   text-sm font-[500] h-60 ">
        <div className="flex flex-col w-full h-full p-2 shadow-md/40 scroll-smooth overflow-auto custom-scroll gap-3">
          {Messages.map((mesg, i) => (
              <div
                key={i}
                className={` ${
                  mesg.type === sent ? "self-end  bg-zinc-700" : "self-start bg-zinc-500"
                } h-fit w-fit flex  p-2 rounded-lg max-w-70 `}
              >
                <div className="text-zinc-200 text-md drop-shadow-sm/80">{mesg.message}</div>
              </div>
          ))}

        </div>

        <form className="flex flex-row items-center bg-zinc-800 font-[500] w-full  mt-auto p-1">
          <input
            placeholder="Type message here ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-2xl w-[80%] h-9 mx-1 flex items-center p-2 text-zinc-200 outline-0 focus:border-zinc-500 border-2 border-zinc-700"
          />
          <button className="ml-auto" onClick={handleSend}>
            <img
              className="bg-zinc-700 rounded-full p-2 size-9   "
              src="./media/send.png"
              alt=""
            />
          </button>
        </form>
      </div>
    </>
  );
};
