import { useEffect, useState } from "react";
import { Header2, Header3 } from "../components/header";

import { Profile } from "../components/profile";

import { Trasition } from "../transition";
import axios from "axios";
import { useUserContext } from "../hooks/contextHook";
import { SearchedPlayer } from "../components/searchedPlayer";
import { User } from "../context/ContextProvider";
import { Notification } from "../components/notification";
import { useSendNotification } from "../hooks/NotificationHook";
import { useNotificationRefresh } from "../context/NotificationProvider";

export type FriendStatus = "REJECTED" | "PENDING" | "ACCEPTED";
export const NOTIFICATION="notification"
export type MessageType = "MESSAGE" | "ACCEPT" | "REQUEST";
export type NotifType="MESSAGE"|"REQUEST"|"CHALLENGE"|"ACCEPT"|""

export type Player = {
  id: string;// userId
  username: string;
  name: string | null;
  profile: string | null;
  sentRequests: { status: FriendStatus }[];
  receivedRequests: { status: FriendStatus }[];
};

export type Message = {
  id: string;
  messageType: MessageType;
  message: string;
  senderId: string;
  sender: { name: string; profile: string; username: string };
};

export type PendingChallenge = {
  friendId: string;
  type: string;
} | null;


const Socials = () => {
  const [search, setSearch] = useState("");
  const [searchedPlayers, setShearchedPlayers] = useState<Player[]>([]);
  const [Friends, setFriends] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [seeAll, setSeeAll] = useState<boolean>(false);
  const [optionOpen, setOptionOpen] = useState(false);

  const {
    user,theme
  } = useUserContext();

  const { sendNotification} = useSendNotification();
  const triggerRefresh = useNotificationRefresh();

////////////////////////// GET FRIENDS LIST LOGIC ///////////////////////////////

  useEffect(() => {
    const getFriends = async () => {
      const response = await axios.get("/social/friends", {
        params: { userId: user?.id },
      });
      setFriends(response.data.Friends);
      setShearchedPlayers([]);
    };
    if (search === "") {
      getFriends();
    }
  }, [triggerRefresh,search]);

/////////////////////////// GET NOTIFICATION LIST LOGIC /////////////////////////////

  useEffect(() => {
    const getNotifications = async () => {
      const response = await axios.get("/social/getmessage", {
        params: { userId: user?.id },
      });
      setNotifications(response.data.messages);
      console.log(response.data.messages);
    };

    getNotifications();
  }, [triggerRefresh,notifications.length]);

 //////////////////////////// SEARCH PLAYER LOGIC /////////////////////////////// 

  async function handleSearch(e:React.SyntheticEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    const response = await axios.get("/social/getPlayer", {
      params: { searchedPlayer: search, userId: user?.id },
    });
    setShearchedPlayers(response.data.players);
    console.log("Message :", response.data.message);
    console.log(response.data.players);
  }

  function OpenMessage(friendId: string) {
    const form = document.getElementById(friendId);
    form?.classList.toggle("hidden");
  }

 ////////////////////////// SEND MESSAGE TO SOCIALPAGE LOGIC ///////////////////////

  async function handleMessageSent(e:React.SyntheticEvent, friend: User, type: string) {
    e.preventDefault();
    console.log("message:", message);
    const response = await axios.post("/social/message", {
      message: message,
      user: user,
      friendId: friend.id,
      type: type,
    });
    console.log(response.data.message);
    sendNotification(friend.id,"MESSAGE",message)
    setMessage("");
    document.getElementById(friend.id)?.classList.add("hidden");
  }

  ///////////////////// REMOVE FROM FRIEND LIST LOGIC /////////////////////// 

  async function handleRemoveFriend(userId: string, friendId: string) {
    const removeFriend=await axios.post("/social/deletefriend", { userId: userId, friendId: friendId });
    console.log(removeFriend.data.message);
    sendNotification(friendId,"","Removed you as friend")
    
    setFriends((prevFriends)=>prevFriends.filter((friend)=> friend.id !== friendId))
  }

  return (
    <div className={`flex w-full min-h-screen bg-gradient-to-r ${theme?" from-zinc-300 to-zinc-100 ":" from-zinc-800 to-zinc-900 "}  h-fit`}>
      <Header2 />
      <Header3 />
      <div className="pt-20 flex flex-col mx-auto h-full w-full p-3 md:p-6 md:pt-28 md:pl-25 xl:pt-10 lg:pl-40 max-w-[1200px] ">
        <Profile />
        <div className=" h-fir w-full py-2 mt-5">
          <div className={`text-2xl font-bold py-3 ${theme?" text-zinc-800 ":"text-zinc-200 "} `}>Messages</div>
          <div className="text-lg text-zinc-800  h-fit flex">
            {notifications && notifications.length > 0 ? (
              <div className="h-fit w-full flex flex-col">
                {(seeAll ? notifications.slice() : notifications.slice(-3))
                  .reverse()
                  .map((notif, i) => {
                    return (
                      <Notification
                        setNotifications={setNotifications}
                        notif={notif}
                        key={i}
                      />
                    );
                  })}
                {notifications.length > 3 && (
                  <div
                    onClick={() => setSeeAll(!seeAll)}
                    className="bg-zinc-800 w-full h-8 md:h-12 border-3 border-zinc-700 justify-center flex items-center text-zinc-300 text-[12px] md:text-md cursor-pointer hover:bg-zinc-700 rounded-lg" 
                  >
                    {seeAll ? "See less" : "See more"}
                  </div>
                )}
              </div>
            ) : (
              <div className={`mx-auto my-5 ${theme?"":"invert"}`}>No message recieved yet</div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col py-2 my-5">
          <div className={`text-2xl font-bold py-3 ${theme?" text-zinc-800 ":"text-zinc-200 "}`}>
            Friends List
          </div>
          <form className="w-full h-8 md:h-10  rounded-sm border-2 border-zinc-400 flex justify-center ">
            <input
              className={`w-[95%] h-full text-sm md:text-md flex-15 outline-0 focus:border-zinc-600 rounded-l-sm focus:border-2 ${theme?"text-zinc-800":"text-zinc-200"} p-1 pl-2`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search PlayerID or Username here"
            />
            <button
              onClick={(e) => handleSearch(e)}
              className="border-l-2 border-zinc-400 w-full h-full md:flex-1 flex-2  flex justify-center items-center text-zinc-600 cursor-pointer hover:bg-zinc-400"
            >
              <img
                className={`size-7 brightness-30 ${theme?"":"invert"}`}
                src="./media/search.png"
                alt=""
              />
            </button>
          </form>
          <div className="text-lg text-zinc-800 min-h-30 h-fit w-full flex flex-col mt-3 items-center rounded-lg overflow-hidden">
            {searchedPlayers && searchedPlayers.length > 0 && search !== "" ? (
              searchedPlayers.map((player, i) => {
                return (
                  <div
                    key={i}
                    className={`${theme?" bg-zinc-800":"bg-zinc-950"} w-full h-fit border-2 m-1 border-zinc-700 flex flex-row p-3 rounded-lg`}
                  >
                    <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full">
                      <img
                        className="rounded-sm size-15 md:size-20"
                        src={player.profile || `./media/userW.png`}
                        alt=""
                      />
                    </div>
                    <div className="w-fit h-full flex flex-col justify-center p-3">
                      <div className="text-sm md:text-lg text-zinc-200">{player.name}</div>
                      <div className="text-zinc-300 text-[12px] md:text-sm">
                        {player.username}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center ml-auto">
                      <div 
                      onClick={()=>sendNotification(player.id,"CHALLENGE","Challenged you to a Rapid Match")}
                      className="hover:bg-zinc-700 cursor-pointer p-1 interact-btn rounded-md flex justify-center duration-200">
                        <img
                          className="size-7 md:size-8 "
                          src="./media/challenge.png"
                          alt=""
                        />

                      </div>
                      <SearchedPlayer player={player} />
                      <div className="hover:bg-zinc-700 cursor-pointer p-1 interact-btn rounded-full flex justify-center duration-200 size-8 items-center">
                        <div className="size-2.5 bg-green-500 rounded-full online"></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : Friends.length > 0 ? (
              Friends.map((friend, i) => {
                return (
                  <div
                    key={i}
                    className={`${theme?" bg-zinc-800":"bg-zinc-950"} w-full h-fit border-2 border-zinc-700 flex flex-row p-3 rounded-lg`}
                  >
                    <div className="bg-zinc-800 border-2 border-zinc-700 rounded-md aspect-square h-full">
                      <img
                        className="rounded-sm size-15 md:size-20"
                        src={friend.profile || `./media/userW.png`}
                        alt=""
                      />
                    </div>
                    <div className="w-fit h-full flex flex-col justify-center p-3">
                      <div className="text-sm md:text-lg text-zinc-200">{friend.name}</div>
                      <div className="text-zinc-300 text-[12px] md:text-sm">
                        {friend.username}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center ml-auto">
                      <div
                        onClick={() =>
                          sendNotification( friend.id, "CHALLENGE","Challenged you to a Rapid Match")
                        }
                        className="hover:bg-zinc-700 cursor-pointer p-1 interact-btn rounded-md flex justify-center duration-200"
                      >
                        <img
                          className="size-7 md:size-8"
                          src="./media/challenge.png"
                          alt=""
                        />
                      </div>
                      <div
                        onClick={() => OpenMessage(friend.id)}
                        className="hover:bg-zinc-700 cursor-pointer md:p-1 interact-btn rounded-md flex justify-center duration-200"
                      >
                        <img
                          className="size-7 md:size-8"
                          src="./media/message.png"
                          alt=""
                        />
                      </div>
                      <form
                        id={friend.id}
                        className={`h-20 w-60 md:w-90 mt-28 md:mt-33 absolute hidden my-auto mx-auto mr-27 `}
                      >
                        <textarea
                          name="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="h-full w-[90%] rounded-md bg-zinc-800 border-2 border-zinc-600 text-zinc-200 text-sm p-2"
                          placeholder="Write your message ..."
                        />
                        <button
                          onClick={(e) => {
                            if (user)
                              handleMessageSent(e, friend, "MESSAGE")

                          }}
                          className=" rounded size-8 absolute ml-auto cursor-pointer bg-emerald-900 hover:bg-emerald-800 mt-1"
                        >
                          <img
                            className="size-7 md:size-8"
                            src="./media/message.png"
                            alt=""
                          />
                        </button>
                      </form>
                      <div className="hover:bg-zinc-700 cursor-pointer p-1 interact-btn rounded-full flex justify-center duration-200 size-8 items-center">
                        <div className="size-2.5 bg-green-500 rounded-full online"></div>
                      </div>
                      <div
                        onClick={() => setOptionOpen(!optionOpen)}
                        className="hover:bg-zinc-700 cursor-pointer md:p-1 interact-btn rounded-md flex justify-center duration-200"
                      >
                        <img
                          className="size-7 md:size-8"
                          src="./media/optionD.png"
                          alt=""
                        />
                      </div>
                      <div
                        onClick={async () =>
                          user&&handleRemoveFriend(user.id, friend.id)
                        }
                        className={`bg-zinc-700 w-fit duration-300 absolute cursor-pointer group mt-15 md:mt-25 ml-10 md:ml-30 rounded-sm   ${
                          optionOpen ? " h-fit max-h-20" : " max-h-0"
                        } duration-200 overflow-hidden`}
                      >
                        <div className="mx-1 my-1 p-1 px-2 text-[12px] md:text-md text-zinc-200 group-hover:bg-red-900/40 duration-200">
                          Remove friend
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`m-5 ${theme?"":"invert"}`}>No Friends yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trasition(Socials);
