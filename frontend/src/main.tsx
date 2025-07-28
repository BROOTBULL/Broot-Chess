import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context/ContextProvider.tsx";
import { NotificationProvider } from "./context/NotificationProvider.tsx";
import { UserContextProvider } from "./context/userProvider.tsx";
import axios from "axios";


axios.defaults.withCredentials=true
axios.defaults.baseURL="https://broot-chess-backend.onrender.com"

createRoot(document.getElementById("root")!).render(
  <Router>
    <UserContextProvider>
      <NotificationProvider>
    <ContextProvider>
        <App />
    </ContextProvider>
      </NotificationProvider>
    </UserContextProvider>
  </Router>
);
