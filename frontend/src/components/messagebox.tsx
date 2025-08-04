import { useEffect, useRef, useState } from "react";
import { useChessContext, useUserContext } from "../hooks/contextHook";
import EmojiPicker from "emoji-picker-react";
import { motion } from "motion/react";

export const MessageBox = () => {
  const CHAT = "chat";

  const [text, setText] = useState("");
  const {user,socket}=useUserContext()
  const { roomId, Messages } = useChessContext();
  const sender=user?.id
  const [emojiBox, setEmojiBox] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [Messages]);



  function handleSend(e:React.SyntheticEvent) {
    e.preventDefault();
    const message = { sender:sender , message: text };
    socket?.send(
      JSON.stringify({
        type: CHAT,
        payload: {
          roomId: roomId,
          message: message,
        },
      })
    );
    setEmojiBox(false);
    setText("");
  }

  return (
    <>
      {}
      <div className="flex flex-col items-center   bg-radial-[at_50%_50%] from-zinc-900 to-zinc-950 to-85%   text-sm font-[500] h-60 ">
        <div className="flex flex-col w-full h-full p-2 shadow-md/40 scroll-smooth overflow-auto custom-scroll gap-3">
          {Messages?.map((mesg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={` ${
                user?.id === mesg.sender
                  ? "self-end  bg-zinc-700"
                  : "self-start bg-zinc-500"
              } h-fit w-fit flex  p-2 rounded-2xl max-w-70 `}
            >
              <div className="text-zinc-50 drop-shadow-sm/90 text-md ">{mesg.message}</div>
            </motion.div>
          ))}
           <div ref={bottomRef} />
        </div>

        <form className="flex flex-row items-center bg-zinc-800 font-[500] w-full  mt-auto p-1">
          <input
            placeholder="Type message here ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded-2xl w-[85%] h-9 mx-1 flex items-center p-2 text-zinc-100 outline-0 focus:border-zinc-500 border-2 border-zinc-700"
          />
          <div
            className={`absolute bottom-20 right-12 duration-200 overflow-hidden ${
              emojiBox ? "h-113 opacity-100" : "h-0 opacity-0"
            }`}
          >
            <EmojiPicker
              onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
            />
          </div>
          <div
            className="ml-auto"
            onClick={(e) => {
              e.preventDefault();
              setEmojiBox(!emojiBox);
            }}
          >
            <img
              className="bg-zinc-700 rounded-full p-2 size-9 cursor-pointer hover:bg-zinc-600 duration-200 "
              src="./media/emoji.png"
              alt=""
            />
          </div>

          <button className="mx-1 9 cursor-pointer" onClick={handleSend}>
            <img
              className="bg-zinc-700 rounded-full p-2 size-9   hover:bg-zinc-600 duration-200 "
              src="./media/send.png"
              alt=""
            />
          </button>
        </form>
      </div>
    </>
  );
};
