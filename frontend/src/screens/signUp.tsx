import { useNavigate } from "react-router-dom";
import { Trasition } from "../transition";
import axios from "axios";
import { useState } from "react";
import { useChessContext } from "../hooks/contextHook";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

const SignUpPage = () => {
  const navigate = useNavigate();
  const {setUser}=useChessContext()


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const UserInput = await axios.post(
      "/auth/signUp",
      formData
    );
    setUser(UserInput.data)
    console.log("SignUp response:", UserInput);
  }

  async function handleGuest(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const guestInput = await axios.post(
      "/auth/signUpGuest",{name:"Guest123"}
    );
    setUser(guestInput.data)
    console.log("response:", guestInput);
  }

  async function handleGoogle(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const response=window.open(`http://localhost:3000/auth/google`, "_self");
    console.log("response",response);
  }

  return (
    <>
      <img
        onClick={() => navigate("/")}
        className="absolute h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 m-5 drop-shadow-lg "
        src="../../public/media/back.png"
        alt="back button"
      />

      <div className="absolute flex flex-row h-full w-full -z-12  ">
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-zinc-300 to-zinc-100 backdrop-blur-md h-full w-full md:w-[56%] -z-10 ">
          <img
            className="h-10 w-6 md:h-14 md:w-9 lg:h-18 lg:w-10 drop-shadow-lg/40 "
            src="../../public/media/Broot.png"
            alt="Broot"
          />
          <span className="text-[40px] flex md:text-[55px] items-end lg:text-[60px] font-serif text-zinc-950 font-[600]  drop-shadow-lg/40">
            SignUp
          </span>
          <div className="w-[80%] h-fit flex m-3 text-center justify-center items-center">
            <form className="flex flex-col " action="">
              <span className="text-[20px] mb-15 md:text-[22px] items-end lg:text-[26px] font-serif text-zinc-800 font-[600] drop-shadow-lg">
                Enter your email and a password
              </span>
              <div className="bg-white pl-2 rounded-t-lg">
                <input
                  className="emailInput w-full h-12 lg:h-14 lg:text-[18px] p-2 focus:outline-none"
                  placeholder="Email"
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="bg-white pl-2">
                <input
                  className="UserInput w-full h-12 lg:h-14 lg:text-[18px] p-2 focus:outline-none"
                  placeholder="Username"
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="bg-white pl-2 rounded-b-lg">
                <input
                  className="passInput w-full h-12 lg:h-14 lg:text-[18px] p-2 focus:outline-none"
                  placeholder="Password"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <button
                onClick={(e) => handleSubmit(e)}
                className="playButton text-center text-[20px] md:text-[25px] lg:text-[30px] md:px-15 lg:px-20 h-fit items-center  bg-zinc-800 px-10 py-2 my-2 rounded-lg shadow-lg/30 text-zinc-100 font-serif cursor-pointer hover:shadow-white "
              >
                Submit
              </button>
            </form>
          </div>
          <span className="text-[10px] md:text-[12px] items-end lg:text-[16px] font-serif text-zinc-800 font-[600] drop-shadow-lg">
            Play as guest OR signup with Google
          </span>
          <div className="flex flex-row w-[80%]">
            <button
              onClick={(e) => handleGuest(e)}
              className="flex text-[15px] md:text-[18px] w-full lg:text-[22px] md:px-5 lg:px-10 h-fit justify-center items-center  bg-zinc-500 px-10 py-2 m-3 shadow-lg/30 text-zinc-100 font-serif cursor-pointer hover:shadow-white "
            >
              <span> Guest</span>
            </button>
            <button
              onClick={(e) => handleGoogle(e)}
              className="flex text-[15px] md:text-[18px] w-full lg:text-[22px] md:px-5 lg:px-10 h-fit justify-center items-center  bg-zinc-500 px-10 py-2 m-3 shadow-lg/30 text-zinc-100 font-serif cursor-pointer hover:shadow-white "
            >
              <img
                className="h-4 w-4 mr-3 drop-shadow-sm"
                src="../public/media/google.png"
                alt="google"
              />
              <span> Google</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trasition(SignUpPage);
