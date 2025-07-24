import { useContext } from "react";
import { ChessContext } from "../context/ContextProvider";
import { UserContext } from "../context/userProvider";

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ContextProvider");
  }
  return context;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ContextProvider");
  }
  return context;
};

