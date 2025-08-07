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
  const { setUser, theme, setTheme } = useUserContext();
  const activetab = window.location.pathname.split("/").filter(Boolean).pop();
  const navigate = useNavigate();

  async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  return (
    <>
      <div
        className={`hader fixed w-full bg-gradient-to-r ${
          theme ? " from-zinc-300 to-zinc-100" : "from-zinc-800 to-zinc-900"
        } z-10 md:hidden rounded-b-3xl`}
      >
        <div className="flex flex-row w-full justify-between">
          <img
            className={` ${
              theme ? "" : "invert"
            } self-center h-10 w-6 md:h-14 md:w-8 lg:h-20 lg:w-12 lg:m-8 m-5 mx-3 md:mx-6 drop-shadow-lg/40 z-10 cursor-pointer`}
            src="/media/Broot.png"
            alt="Broot"
          />
          <div className="flex flex-row">
            <img
              onClick={() => {
                setTheme(!theme);
              }}
              className={` self-center flex m-3 ${theme ? " rotate-90 size-8 " : " size-6 rotate-0 "} ${optionDisplay?" mr-4 opacity-100 rotate-0 cursor-pointer ":" mr-0 opacity-0 rotate-90 pointer-events-none "} lg:m-8 drop-shadow-sm/80 z-10 duration-200`}
              src={`/media/${theme ? "light" : "dark"}.png`}
              alt="option"
            />
            <button
              onClick={() => setOptionDisplay(!optionDisplay)}
            >
            <img
              className={`${
                theme ? "" : "invert"
              } self-center size-8 md:size-13 lg:hidden  m-3 ml-0 drop-shadow-lg/40 z-10 cursor-pointer ${optionDisplay?"rotate-45":"rotate-0"} duration-200`}
              src={`/media/${optionDisplay ? "closeOption" : "option"}.png`}
              alt="option"
            />
            </button>
          </div>
        </div>
        <div
          className={`bg-gradient-to-r  ${
            theme ? " from-zinc-300 to-zinc-100" : "from-zinc-800 to-zinc-900"
          } shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-b-3xl w-full z-10 flex-col duration-300 flex lg:hidden overflow-hidden pl-5 gap-0.5 ${
            optionDisplay ? "h-55 opacity-100 " : "h-0 opacity-0"
          }`}
        >
          <div
            onClick={() => navigate("/home")}
            className={`${activetab === "home" ? "active" : ""} ${
              theme ? "" : "invert"
            } nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}
          >
            <img className="img h-6 w-6 m-2" src="/media/home.png" alt="" />
            Home
          </div>
          <div
            onClick={() => navigate("/game")}
            className={`${activetab === "game" ? "active" : ""} ${
              theme ? "" : "invert"
            } nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}
          >
            <img className="img h-6 w-6 m-2" src="/media/play.png" alt="" />
            Play
          </div>
          <div
            onClick={() => navigate("/profile")}
            className={`${activetab === "profile" ? "active" : ""} ${
              theme ? "" : "invert"
            } nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}
          >
            <img className="img h-6 w-6 m-2" src="/media/profile.png" alt="" />
            Profile
          </div>
          <div
            onClick={() => navigate("/social")}
            className={`${activetab === "social" ? "active" : ""} ${
              theme ? "" : "invert"
            } nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-zinc-800`}
          >
            <img className="img h-6 w-6 m-2" src="/media/social.png" alt="" />
            Socials
          </div>
          <div
            onClick={handleLogout}
            className={`nav flex flex-row items-center h-10 w-[95%] rounded-lg font-[500] text-lg text-red-400`}
          >
            <img
              className={`img h-6 w-6 m-2`}
              src="/media/logOutR.png"
              alt=""
            />
            LogOut
          </div>
        </div>
      </div>
    </>
  );
};

export const Header3 = () => {
  const [optionDisplay, setOptionDisplay] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUser, theme, setTheme } = useUserContext();
  const activetab = window.location.pathname.split("/").filter(Boolean).pop();

  async function handleLogout() {
    const responce = await axios.post("/auth/logout", {});
    setUser(null);
    console.log(responce);
  }

  return (
    <>
      <div className="hader fixed h-full z-10 hidden md:flex ">
        <div className="flex flex-col w-full justify-between">
          <img
            className={` h-10 w-6 md:h-14 md:w-8 lg:h-22 lg:w-12 lg:m-8 lg:mx-10 m-5 drop-shadow-lg/40 z-10 cursor-pointer ${
              theme ? "" : "invert"
            }`}
            onClick={() => navigate("/")}
            src="/media/Broot.png"
            alt="Broot"
          />
          <div
            className={`bg-gradient-to-r from-zinc-300 to-zinc-100 bg-none xl:shadow-none rounded-r-3xl w-fit z-10 flex-col duration-300 flex pl-5 h-fit ${
              theme ? "" : "invert"
            }`}
          >
            <div
              onClick={() => navigate("/profile")}
              className={`${
                activetab === "profile" ? "active" : ""
              } nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}
            >
              <img
                className="img size-8 lg:size-10  lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300 p-1"
                src={`/media/profile.png`}
                alt=""
              />
              <div className="hidden xl:flex">Profile</div>
            </div>
            <div
              onClick={() => navigate("/game")}
              className={`${
                activetab === "game" ? "active" : ""
              } nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}
            >
              <img
                className="img size-8 lg:size-10  lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300 p-1"
                src="/media/play.png"
                alt=""
              />
              <div className="hidden xl:flex">Play</div>
            </div>
            <div
              onClick={() => navigate("/home")}
              className={`${
                activetab === "home" ? "active" : ""
              } nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}
            >
              <img
                className="img size-8 lg:size-10  lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300 p-1"
                src="/media/home.png"
                alt=""
              />
              <div className="hidden xl:flex ">Home</div>
            </div>
            <div
              onClick={() => navigate("/social")}
              className={`${
                activetab === "social" ? "active" : ""
              } nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}
            >
              <img
                className="img size-8 lg:size-10  lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300 p-1"
                src="/media/social.png"
                alt=""
              />
              <div className="hidden xl:flex">Social</div>
            </div>
            <div
              className={`${
                activetab === "assets" ? "active" : ""
              } nav flex flex-row items-center hover:ml-4 rounded-3xl xl:w-35 duration-300 m-1 cursor-pointer`}
            >
              <img
                className="img size-8 lg:size-10  lg:m-3 xl:m-2 xl:size-7 xl:ml-3 duration-300 p-1"
                src="/media/assets.png"
                alt=""
              />
              <div className="hidden xl:flex">Assets</div>
            </div>
          </div>
          <img
            onClick={() =>  setOptionDisplay(!optionDisplay)}
            className={`size-8 hidden md:flex m-3 lg:m-8 lg:mx-10 drop-shadow-lg/40 z-10 cursor-pointer ${optionDisplay?"rotate-90":"rotate-0"} duration-200 ${
              theme ? "" : "invert"
            }`}
            src={`/media/setting.png`}
            alt="option"
          />
        </div>
        <div
          className={`absolute left-0 bottom-10 m-8 w-60 bg-gradient-to-r from-zinc-200 to-zinc-100 ${
            theme ? "shadow-[0_5px_20px_rgba(0,0,0,0.35)]" : "invert"
          }  cursor-pointer rounded-lg z-10 flex-col duration-300 md:flex hidden overflow-hidden ${
            optionDisplay ? "h-fit opacity-100 " : "h-0 opacity-0"
          }`}
        >
          <div
            onClick={() => setTheme(!theme)}
            className="nav flex flex-row m-3 mb-0 items-center h-10 w-[90%] rounded-lg font-[500] text-lg text-zinc-800"
          >
            <img className="img h-6 w-6 m-2" src="/media/theme.png" alt="" />
            Theme
          </div>
          <div
            onClick={() => handleLogout()}
            className={`${
              theme ? "hover:bg-black" : "invert hover:bg-white"
            } flex flex-row m-3 mt-0 items-center h-10 w-[90%] rounded-lg font-[500] text-lg text-red-400`}
          >
            <img
              className={`h-6 w-6 m-2 img `}
              src="/media/logOutR.png"
              alt=""
            />
            LogOut
          </div>
        </div>
      </div>
    </>
  );
};
