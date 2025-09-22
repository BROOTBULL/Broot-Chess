import { useNavigate } from "react-router-dom";
import { Trasition } from "../transition";
// import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();


  async function handlePlay()
  {
    
    navigate("/signUp");
        
  }

  return (
    <div className="flex h-full w-full">
      <img
        className="absolute h-12 w-7 md:h-22 md:w-13 lg:h-24 lg:w-13 m-3 md:m-10 drop-shadow-lg/40 "
        src="/media/Broot.png"
        alt="Broot"
      />
      <button
        onClick={() => handlePlay()}
        className="absolute flex justify-end w-full h-fit self-end  "
      >
        <div className="playButton play text-[20px] md:text-[30px] lg:text-[45px] md:px-15 lg:px-20  flex h-fit items-center  bg-white px-9 py-3 m-3 shadow-lg/30 text-zinc-700 font-serif cursor-pointer hover:shadow-white gap-1">
          Play
          <img
            className="size-5 md:h-10 md:w-8 lg:h-14 lg:w-12 transition duration-400 "
            src="/media/icon.png"
            alt=""
          />
        </div>
      </button>

      <div className="absolute flex flex-row h-full w-full bg-[url(/media/image.png)] bg-center bg-cover bg-no-repeat -z-10">
        <div className="flex justify-end items-center bg-gradient-to-r from-zinc-300 to-zinc-100 backdrop-blur-md h-full w-[60%] md:w-[56%] -z-9 ">
          <span className="text-[100px] md:text-[150px] lg:text-[200px] font-serif text-zinc-950 font-[100] h-60 ml-30">
            CHE
          </span>
        </div>
        <div className="flex  h-full items-center flex-grow bg-black/70">
          <span className="text-[100px] md:text-[150px] lg:text-[200px] font-serif text-white font-[100] h-60 ">
            SS
          </span>
          <span className="absolute text-[10px] md:text-[15px] lg:text-[20px] font-serif text-zinc-100 font-[100] mt-6 md:mt-32 lg:mt-62 ml-3  ">Where Every Move Matters</span>
              
        </div>
      </div>
    </div>
  );
};

export default Trasition(LandingPage);
