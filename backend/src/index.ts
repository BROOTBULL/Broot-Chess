import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

import { initPassport } from "./passport"; // contains GoogleStrategy
import authRoute from "./auth/auth";
import gameRoute from "./auth/gameData";
import interactionRoute from "./auth/userInteraction";

// Initialize
dotenv.config();
const app = express();
const isProd = process.env.NODE_ENV === "production";

// CORS first
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

// Parsing middlewares
app.use(express.json());
app.use(cookieParser());


// Passport initialization (for Google login only)
initPassport();
app.use(passport.initialize());


// Routes
app.use("/auth", authRoute); // includes Google login + JWT token issuing
app.use("/gameData", gameRoute);
app.use("/social", interactionRoute);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
