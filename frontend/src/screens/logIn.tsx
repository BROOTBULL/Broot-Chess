import { useNavigate } from "react-router-dom";
import { Trasition } from "../transition";
import axios from "axios";
import { useState } from "react";
import { useUserContext } from "../hooks/contextHook";

const LogInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );

  const [formData, setFormData] = useState({
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

  function displayError(error: string) {
    setError(error);

    // Auto-clear error after 3 seconds (3000 ms)
    setTimeout(() => {
      setError(null);
    }, 3000);
    setRegistering(false);
    return;
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setRegistering(true);
    const emailError = validateEmail(formData.email);
    if (emailError) {
      displayError(emailError);
    }

    try {
      const response = await axios.post("/auth/login", formData);
      setUser(response.data);

      console.log("Login successful:", response.data);
    } catch (error) {
      setError("Login Failed ..!! Please check your entries!");
      console.error("Login failed:", error);
    }
    setRegistering(false);
  };

  async function handleGuest(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setLoading(true);
    const guestInput = await axios.post("/auth/signUpGuest", {
      name: "Guest123",
    });
    setLoading(false);
    setUser(guestInput.data);
    console.log("response:", guestInput);
  }

  async function handleGoogle(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const response = window.open(
      `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
      "_self"
    );
    console.log("response", response);
  }

  function validateEmail(email: string): string | null {
    if (!email.trim()) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    return null; // No error
  }
  function handlePasswordType(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    setPasswordType(passwordType === "password" ? "text" : "password");
  }

  return (
    <div className="h-screen w-full relative">
      <img
        onClick={() => navigate("/")}
        className="absolute h-6 w-6 md:h-8 md:w-8 lg:size-6 m-5 drop-shadow-lg z-10 cursor-pointer"
        src="/media/back.png"
        alt="back button"
      />

      <div className="absolute flex flex-row h-full w-full bg-[url(/media/image.png)] bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-zinc-300 to-zinc-100 backdrop-blur-md h-full w-full md:w-[50%] ">
          {error && (
            <div className="bg-red-400 h-10 w-[60%] rounded-lg absolute top-0 mt-5 text-center p-2 text-white ">
              {error}
            </div>
          )}
          <img
            className="lg:h-16 lg:w-10 md:h-18 md:w-12 h-14 w-9 mb-5 mx-4"
            src="/media/Broot.png"
            alt="Broot"
          />
          <span className="text-2xl flex md:text-3xl items-end lg:text-4xl font-bold text-zinc-900">
            LogIn
          </span>
          <div className="w-[80%] h-fit flex m-3 text-center justify-center items-center">
            <form className="flex flex-col w-[90%]" action="">
              <span className="text-base mb-5 items-end text-zinc-800 font-[600] drop-shadow-lg">
                Enter your email and a password
              </span>
              <div className="bg-white pl-2 rounded-t-lg border-1 border-zinc-400 border-b-transparent">
                <input
                  className="emailInput w-full h-10 lg:h-14 lg:text-[18px] p-2 focus:outline-none"
                  placeholder="Email"
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="bg-white pl-2 rounded-b-lg flex flex-row border-t-transparent border-1 border-zinc-400">
                <input
                  className="passInput w-[90%] h-10 lg:h-14 lg:text-[18px] p-2 focus:outline-none"
                  placeholder="Password"
                  type={passwordType}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  autoComplete="off"
                />
                <button className="cursor-pointer" onClick={handlePasswordType}>
                  <img
                    className="size-6 mx-4"
                    src={`./media/${
                      passwordType === "password" ? "eyeClosed" : "eye"
                    }.png`}
                    alt=""
                  />
                </button>
              </div>

              <button
                onClick={(e) => handleSubmit(e)}
                className="playButton text-center  md:px-15 lg:px-20 h-fit items-center  bg-zinc-800 px-10 py-2 my-2 rounded-lg shadow-lg/30 text-zinc-100 font-serif cursor-pointer hover:shadow-white "
              >
                {!registering ? (
                  <div className="text-sm md:text-md lg:text-lg ">Submit</div>
                ) : (
                  <div className="flex flex-row justify-center text-sm md:text-md lg:text-lg">
                    Logging In...
                  </div>
                )}
              </button>
            </form>
          </div>
          <div className=" items-end text-sm font-serif text-zinc-800 font-[600] drop-shadow-lg">
            Play as guest OR login with Google
          </div>
          <div className="flex flex-row w-[80%] lg:w-[65%]">
            <button
              onClick={(e) => handleGuest(e)}
              className="flex text-sm rounded-lg w-full lg:text-base md:px-5 lg:px-10 h-fit justify-center items-center  bg-zinc-500 px-10 py-3 m-3 shadow-lg/30 text-zinc-100 text-shadow-xs/90 font-bold cursor-pointer hover:shadow-lg/50 duration-200 "
            >
              {loading ? <div>Signing Up...</div> : <span> Guest</span>}
            </button>
            <button
              onClick={(e) => handleGoogle(e)}
              className="flex text-sm rounded-lg w-full lg:text-base md:px-5 lg:px-10 h-fit justify-center items-center  bg-zinc-500 px-10 py-3 m-3 shadow-lg/30 text-zinc-100 text-shadow-xs/90 font-bold cursor-pointer hover:shadow-lg/50 duration-200 "
            >
              <img
                className="h-4 w-4 mr-3 drop-shadow-sm/50"
                src="/media/google.png"
                alt="google"
              />
              <span> Google</span>
            </button>
          </div>
          <div className="text-[12px] font-serif text-zinc-600">
            Register a new Account...{" "}
            <button
              className="text-blue-800 cursor-pointer"
              onClick={() => navigate("/signUp")}
            >
              SignUp
            </button>
          </div>
        </div>
        <div className="hidden md:flex h-full md:w-[50%] bg-black/70"></div>
      </div>
    </div>
  );
};

export default Trasition(LogInPage);
