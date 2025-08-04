import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHook";
import axios from "axios";

export const Header = () => {
  return (
    <>
      <div className="bg-zinc-300 z-0 shadow-lg w-full p-3 h-16">
        <img
          className=" h-10 w-13 drop-shadow-lg/40  "
          src="/media/Broot.png"
          alt="Broot"
        />
      </div>
    </>
  );
};

export const Header2 = () => {
  const [optionDisplay, setOptionDisplay] = useState<boolean>(false);
  const {setUser}=useUserContext()
  const activetab = window.location.pathname.split('/').filter(Boolean).pop();
  const navigate=useNavigate()

  function handleOptionButton() {
    setOptionDisplay(!optionDisplay);
    document.getElementById("setting2")?.classList.toggle("rotate-[45deg]");
    document.getElementById("optionBtn")?.classList.toggle("rotate-[45deg]");
  }
  function handleOpenSetting()
  {

  }

   async function handleLogout() {
      const responce = await axios.post("/auth/logout", {});
      setUser(null);
      console.log(responce);
    }

  return (
    <>
      <div className="hader fixed w-full bg-gradient-to-r from-zinc-300 to-zinc-100 z-10 lg:hidden rounded-b-3xl">
        <div className="flex flex-row w-full justify-between">
          <img
            className=" self-center h-10 w-6 md:h-14 md:w-8 lg:h-20 lg:w-12 lg:m-8 m-5 mx-3 md:mx-6 drop-shadow-lg/40 z-10 cursor-pointer"
            src="/media/Broot.png"
            alt="Broot"
          />
          <img
            onClick={() => handleOptionButton()}
            id="optionBtn"
            className="self-center size-8 md:size-13 lg:hidden  m-3 drop-shadow-lg/40 z-10 cursor-pointer duration-200"
            src={`/media/${
              optionDisplay ? "closeOption" : "option"
            }.png`}
            alt="option"
          />
          <img
            onClick={() => handleOptionButton()}
            id="setting2"
            className="self-center size-10 hidden lg:flex m-3 lg:m-8 drop-shadow-lg/40 z-10 cursor-pointer duration-200"
            src={`/media/setting.png`}
            alt="option"
          />
        </div>
        <div
          className={`absolute right-0 top-18 m-8 w-60 bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-lg z-10 flex-col duration-300 lg:flex hidden overflow-hidden ${
            optionDisplay ? "h-fit opacity-100 " : "h-0 opacity-0"
          }`}
        >
          <div className="nav flex flex-row m-3 mb-0 items-center h-10 w-[90%] rounded-lg font-[500] text-lg text-zinc-800">
            <img
              className="h-6 w-6 m-2"
              src="/media/theme.png"
              alt=""
            />
            Theme
          </div>
          <div 
          onClick={()=>handleLogout()}
          className="nav flex flex-row m-3 mt-0 items-center h-10 cursor-pointer w-[90%] rounded-lg font-[500] text-lg text-zinc-800">
            <img
              className="h-6 w-6 m-2"
              src="/media/logout.png"
              alt=""
            />
            LogOut
          </div>
        </div>
        <div
          className={`bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-b-3xl w-full z-10 flex-col duration-300 flex lg:hidden overflow-hidden pl-5 gap-0.5 ${
            optionDisplay ? "h-55 opacity-100 " : "h-0 opacity-0"
          }`}
        >
          <div
          onClick={()=>navigate("/home")} 
          className={`${activetab==="home"?"active":""} nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}>
            <img
              className="img h-6 w-6 m-2"
              src="/media/home.png"
              alt=""
            />
            Home
          </div>
          <div
          onClick={()=>navigate("/game")} 
          className={`${activetab==="game"?"active":""} nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}>
            <img
              className="img h-6 w-6 m-2"
              src="/media/play.png"
              alt=""
            />
            Play
          </div>
          <div
          onClick={()=>navigate("/profile")} 
          className={`${activetab==="profile"?"active":""} nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}>
            <img
              className="img h-6 w-6 m-2"
              src="/media/profile.png"
              alt=""
            />
            Profile
          </div>
          <div
          onClick={()=>navigate("/social")} 
          className={`${activetab==="social"?"active":""} nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}>
            <img
              className="img h-6 w-6 m-2"
              src="/media/social.png"
              alt=""
            />
            Socials
          </div>
          <div 
          onClick={handleOpenSetting}
          className={`nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}>
            <img
              className="img h-6 w-6 m-2"
              src="/media/setting.png"
              alt=""
            />
            Setting
          </div>
        </div>
      </div>
    </>
  );
};

export const Header3 = () => {
  const [optionDisplay, setOptionDisplay] = useState<boolean>(false);
  const navigate=useNavigate();
  const {setUser}=useUserContext()
  const activetab = window.location.pathname.split('/').filter(Boolean).pop();



  function handleOptionButton() {
    setOptionDisplay(!optionDisplay);
    document.getElementById("setting3")?.classList.toggle("rotate-[45deg]");
  }

   async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  return (
    <>
      <div className="hader fixed h-full z-10 hidden lg:flex ">
        <div className="flex flex-col w-full justify-between">
          <img
            className=" h-10 w-6 md:h-14 md:w-8 lg:h-22 lg:w-12 lg:m-8 lg:mx-10 m-5 drop-shadow-lg/40 z-10 cursor-pointer"
            onClick={()=>navigate("/")}
            src="/media/Broot.png"
            alt="Broot"
          />
          <div
            className={`bg-gradient-to-r from-zinc-300 to-zinc-100 xl:bg-none xl:shadow-none shadow-[0_15px_25px_rgba(0,0,0,0.25)] rounded-r-3xl w-fit z-10 flex-col duration-300 flex pl-5 h-fit`}
          >
            <div 
            onClick={()=>navigate("/profile")}
            className={`${activetab==="profile"?"active":""} nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}>
              <img
                className="img size-10 lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300"
                src={`/media/profile.png`}
                alt=""
              />
              <div className="hidden xl:flex">Profile</div>
            </div>
            <div 
            onClick={()=>navigate("/game")}
            className={`${activetab==="game"?"active":""} nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}>
              <img
                className="img size-10 lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300"
                src="/media/play.png"
                alt=""
              />
              <div className="hidden xl:flex">Play</div>
            </div>
            <div 
            onClick={()=>navigate("/home")}
            className={`${activetab==="home"?"active":""} nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}>
              <img
                className="img size-10 lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300"
                src="/media/home.png"
                alt=""
              />
              <div className="hidden xl:flex ">Home</div>
            </div>
            <div 
            onClick={()=>navigate("/social")}
            className={`${activetab==="social"?"active":""} nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}>
              <img
                className="img size-10 lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300"
                src="/media/social.png"
                alt=""
              />
              <div 
              className="hidden xl:flex">Social</div>
            </div>
            <div className={`${activetab==="assets"?"active":""} nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}>
              <img
                className="img size-10 lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300"
                src="/media/assets.png"
                alt=""
              />
              <div className="hidden xl:flex">Assets</div>
            </div>
          </div>
          <img
            onClick={() => handleOptionButton()}
            id="setting3"
            className="size-8 hidden lg:flex m-3 lg:m-8 lg:mx-10 drop-shadow-lg/40 z-10 cursor-pointer duration-200"
            src={`/media/setting.png`}
            alt="option"
          />
        </div>
        <div
          className={`absolute left-0 bottom-10 m-8 w-60 bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-[0_35px_35px_rgba(0,0,0,0.25)] cursor-pointer rounded-lg z-10 flex-col duration-300 lg:flex hidden overflow-hidden ${
            optionDisplay ? "h-fit opacity-100 " : "h-0 opacity-0"
          }`}
        >
          <div className="nav flex flex-row m-3 mb-0 items-center h-10 w-[90%] rounded-lg font-[500] text-lg text-zinc-800">
            <img
              className="img h-6 w-6 m-2"
              src="/media/theme.png"
              alt=""
            />
            Theme
          </div>
          <div 
          onClick={()=>handleLogout()}
          className="nav flex flex-row m-3 mt-0 items-center h-10 w-[90%] rounded-lg font-[500] text-lg text-zinc-800">
            <img
              className="h-6 w-6 m-2 img"
              src="/media/logout.png"
              alt=""
            />
            LogOut
          </div>
        </div>
      </div>
    </>
  );
};
