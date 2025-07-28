import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";

import { initPassport } from "./passport";
import authRoute from "./auth/auth";
import gameRoute from "./auth/gameData";
import interactionRoute from "./auth/userInteraction";

// ✅ Initialize
dotenv.config();
const app = express();
const isProd = process.env.NODE_ENV === "production";

// ✅ CORS first (must be before session and passport)
const allowedOrigins = (process.env.ALLOWED_HOST || "").split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);

// ✅ Parsing middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Session middleware
app.use(
  session({
    secret: process.env.COOKIE_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,                    
      sameSite: isProd ? "none" : "lax", 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,   
    },
  })
);

// ✅ Passport initialization
initPassport();
app.use(passport.initialize());
app.use(passport.authenticate("session"));

// ✅ Route mounting
app.use("/auth", authRoute);
app.use("/gameData", gameRoute);
app.use("/social", interactionRoute);

// ✅ Health route (optional)
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// ✅ Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
