import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import HomePage from "./screens/homePage";
import ChessGame from "./screens/chessPage";
import SignUpPage from "./screens/signUp";
import LogInPage from "./screens/logIn";
import { ReactNode } from "react";
import { useUserContext } from "./hooks/contextHook";
import LandingPage from "./screens/LandingPage";
import Socials from "./screens/socials";
import ProfilePage from "./screens/profilePage";
import { LandingLoader } from "./assets/loader";

// 1. Route guard for authenticated users
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();

  if (user === null) return <Navigate to="/signup" replace />;
  return <>{children}</>;
};

// 2. Route guard to redirect if user is already authenticated
const RedirectIfAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();

  if (user !== null) return <Navigate to="/home" replace />;
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const { loading} = useUserContext(); // Optional: show spinner while auth check runs

  if (loading) {
    return <LandingLoader />; // Replace with spinner or splash screen
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<RedirectIfAuth><SignUpPage /></RedirectIfAuth>} />
        <Route path="/login" element={<RedirectIfAuth><LogInPage /></RedirectIfAuth>} />
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path={`/profile/:playerId`} element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path={`/game`} element={<RequireAuth><ChessGame /></RequireAuth>} />
        <Route path={`/social`} element={<RequireAuth><Socials/></RequireAuth>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
