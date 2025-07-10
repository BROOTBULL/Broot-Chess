import { useContext } from "react";
import { ChessContext } from "../context/ContextProvider";

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("useChessContext must be used within a ContextProvider");
  }
  return context;
};
