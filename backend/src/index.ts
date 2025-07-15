import express from "express";
import cookieParser from "cookie-parser"
import cors from 'cors';
import session from "express-session"
import dotenv from "dotenv"
import { initPassport } from "./passport";
import passport from "passport";
import authRoute from "./auth/auth"
import gameRoute from "./auth/gameData";

const app=express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:process.env.COOKIE_SECRET|| 'keyboard cat',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false,maxAge:24 * 60 * 60 * 1000}
}))

initPassport();

app.use(passport.initialize());  //It sets up the middleware so Passport can start handling authentication, use strategies like Google
app.use(passport.authenticate("session"));  //tells Passport to use session-based authentication ,reads session cookie
const allowedOrigins = (process.env.ALLOWED_HOST || "").split(",");
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

app.use('/auth', authRoute);
app.use("/gameData",gameRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
