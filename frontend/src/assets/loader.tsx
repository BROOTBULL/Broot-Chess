import { motion } from "motion/react";
import { useUserContext } from "../hooks/contextHook";

export const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="absolute w-full h-full bg-[url(./media/image.png)] bg-cover bg-no-repeat bg-center brightness-10 -z-10"></div>
      <div className="aspect-square size-32 flex flex-wrap gap-1 justify-between items-center">
        <div className="bg-zinc-700 aspect-square size-9 loader delay-1 "></div>
        <div className="bg-zinc-100 aspect-square size-9 loader delay-2 "></div>
        <div className="bg-zinc-700 aspect-square size-9 loader delay-3 "></div>
        <div className="bg-zinc-100 aspect-square size-9 loader "></div>
        <div className="bg-zinc-700 aspect-square size-9 loader delay-3 "></div>
        <div className="bg-zinc-100 aspect-square size-9 loader delay-2 "></div>
        <div className="bg-zinc-700 aspect-square size-9 loader delay-1 "></div>
        <div className="bg-zinc-100 aspect-square size-9 loader "></div>
        <div className="bg-zinc-700 aspect-square size-9 loader delay-1 "></div>
      </div>
    </div>
  );
};

export const SearchingLoader = () => {
  return (
    <div className="p-3 lg:h-full h-120 bg-zinc-700 flex justify-center items-center w-full max-w-[1000px]">
      <div className="h-50 w-80 flex flex-col items-center overflow-hidden">
        <div className="[perspective:800px] [perspective-origin:top] h-25 w-60 mt-auto ">
          <div>
            <img
              className="absolute size-20 z-1 drop-shadow-md/100"
              src="/media/pieces/pw.png"
              alt=""
            />
          </div>
          <motion.div
            className="absolute size-20 ml-40 z-1 drop-shadow-md/100"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: [120, 40, 0, -120], // Left to right
              y: [-80, -50, 0, -80], // Bounce up and down
              opacity: [0, 0.7, 1, 1, 1, 0],
            }}
            transition={{
              duration: 3.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <img src="/media/pieces/pb.png" alt="" className="w-full h-full" />
          </motion.div>
          <div className=" w-fit h-full [transform:rotateX(80deg)] flex flex-wrap justify-center">
            <div className="bg-zinc-900 aspect-square size-18 "></div>
            <div className="bg-white aspect-square size-18 "></div>
            <div className="bg-zinc-900 aspect-square size-18 "></div>
            <div className="bg-white aspect-square size-18 "></div>
            <div className="bg-zinc-900 aspect-square size-18 "></div>
            <div className="bg-white aspect-square size-18 "></div>
            <div className="bg-zinc-900 aspect-square size-18  "></div>
            <div className="bg-white aspect-square size-18 "></div>
            <div className="bg-zinc-900 aspect-square size-18 "></div>
          </div>
        </div>
        <div className="text-zinc-200 font-bold text-md m-3 flex flex-row">
          Searching for Opponent{" "}
          <div className="animate-bounce delay-1 mx-1">.</div>
          <div className="animate-bounce delay-2 mx-1">.</div>
          <div className="animate-bounce delay-3 mx-1">.</div>
        </div>
      </div>
    </div>
  );
};

// export const LandingLoader = () => {
//   const {theme}=useUserContext()
//   return (
//     <div className={`w-full h-full flex justify-center items-center brightness-95 ${theme?"":"invert"} `}>
//       <div className="absolute w-full h-full bg-white -z-10" />
//       <div className="absolute w-50 h-100 bg-white z-10 mr-70 " />
//       <div className="persp">
//         <div className="aspact-square size-30 absolute shape rounded-sm border-3 border-l-transparent border-b-transparent border-t-zinc-600 border-r-zinc-300 bg-black ml-7 landingloader2 drop-shadow-lg/90" />
//         <div className="aspact-square w-13 h-29 ml-20 shape rounded-sm border-3 border-l-transparent border-b-transparent border-t-zinc-600 border-r-zinc-300 bg-black mt-21  mr-32 landingloader3 drop-shadow-lg/90" />
//       </div>
//       <div className="persp absolute ml-18">
//         <div className="aspact-square size-10 shape rounded-sm border-3 border-l-transparent border-b-transparent border-t-zinc-600 border-r-zinc-300 bg-black mt-13 mb-5 landingloader drop-shadow-lg/90" />
//         <div className="aspact-square size-10 shape rounded-sm border-3 border-l-transparent border-b-transparent border-t-zinc-600 border-r-zinc-300 bg-black landingloader1 drop-shadow-lg/90" />
//       </div>
//     </div>
//   );
// };

export function LandingLoader() {
    const {theme}=useUserContext()
  return (
    <div className={` ${theme?"":"invert"} flex items-center justify-center h-fit scale-50 lg:scale-80 w-fit`}>
      <div className=" h-60 w-30 perspective-[1000px] relative overflow-clip ml-4 ">
        <div className="loadingTile bg-linear-to-br from-black to-zinc-600 border-3 border-t-transparent border-l-transparent border-b-zinc-950 border-r-zinc-800 absolute size-30 -left-16 top-1"></div>
        <div className="loadingTile2 bg-linear-to-br from-black to-zinc-600 border-3 border-t-transparent border-l-transparent border-b-zinc-950 border-r-zinc-800 absolute h-29 w-13 -left-3 top-22"></div>
      </div>
      <div className="h-60 w-10 perspective-[1000px] absolute ml-14 ">
        <div className="loadingFallingTile bg-linear-to-br from-black to-zinc-600 border-3 border-t-transparent border-l-transparent border-b-zinc-950 border-r-zinc-800 absolute size-10 top-20"></div>
        <div className="loadingFallingTile2 bg-linear-to-br from-black to-zinc-600 border-3 border-t-transparent border-l-transparent border-b-zinc-950 border-r-zinc-800 absolute size-10 top-35"></div>
      </div>
    </div>
  );
}
