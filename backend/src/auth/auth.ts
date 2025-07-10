import { Request, Response, Router } from "express";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "./verifyToken";

dotenv.config();

const router = Router();
const secret = process.env.JWT_SECRET;
const CLIENT_URL = "http://localhost:5173/home";    

interface UserDetails {
  id: string;
  username: string;
  name:string;
  profile:string,
  email:string;
  rating:number;
  token?: string;
  isGuest: boolean;
}

interface userjwtClaims {
  userId: string;
  username: string;
  name:string;
  profile:string;
  email:string;
  rating:number;
  token?: string;
  isGuest?: boolean;
}

// check Auth

router.get("/checkAuth", verifyToken, async (req: Request, res: Response) => {
 try {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const userId = req.userId as string;
      const userDb = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });


    if (!userDb) {
      console.log("no user found");

     res.status(400).json({ success: true, message: "User not found" });
     return;
    }
    const token = jwt.sign({ userId: userId, name: userDb?.name, rating:userDb.rating ,profile:userDb.profile }, secret);
    
    const UserDetails: UserDetails = {
    id: userDb.id,
    username:userDb.username!,
    profile:userDb.profile!,
    name: userDb.name!,
    email:userDb.email,
    rating:userDb.rating,
    token: token,
    isGuest: false,
  };
    res.status(200).json({
      UserDetails,isAuthanticated:true
    });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(401).json({ success: false, message: "Unauthorized" }); 
  }
});

// login guest if reload or revisit

router.post("/login", async (req: Request, res: Response) => {
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  if (req.user) {
    const user = req.user as UserDetails;

    // Token is issued so it can be shared b/w HTTP and ws server
    // Todo: Make this temporary and add refresh logic here

    const userDb = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    const token = jwt.sign({ userId: user.id, name: userDb?.name ,rating:user.rating,profile:userDb?.profile }, secret);
    res.json({
      token,
      id: user.id,
      name: userDb?.name,
    });
  } else if (req.cookies && req.cookies.guest) {
    const decoded = jwt.verify(req.cookies.guest, secret) as userjwtClaims;
    const token = jwt.sign(
      { userId: decoded.userId, name: decoded.name, rating:decoded.rating},
      secret
    );
    let User: UserDetails = {
      id: decoded.userId,
      name: decoded.name,
      username:decoded.username!,
      profile:decoded.profile!,
      email:decoded.email,
      rating:decoded.rating,
      token: token,
      isGuest: false,
    };
    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
    res.json(User);
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

// login with google

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google redirect
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // ✅ req.user is available here from the passport callback
    const user = req.user as UserDetails;
    console.log("user in backend: ",user);
    

    if (!secret) {
      throw new Error("secret not defined");
    }

    // ✅ Generate token
    const token = jwt.sign(
      { userId: user.id, name: user.name, rating: user.rating , profile: user.profile },
      secret,
      { expiresIn: "1d" }
    );

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // ✅ Redirect to frontend
    res.redirect(CLIENT_URL); // e.g. http://localhost:5173
  }
);

// Player signUp in game

router.post("/signUp", async (req: Request, res: Response) => {
  const bodyData = req.body;
  console.log(req.body);
  let guestUUID = "guest-" + uuidv4();

  const user = await prisma.user.create({
    data: {
      username: bodyData.username,
      email: bodyData.email,
      profile:bodyData.profile,
      name: bodyData.username || guestUUID,
      rating:500,
      password: bodyData.password,
      provider: "EMAIL",
    },
  });
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { userId: user.id, name: user.name, rating:user.rating,profile:user.profile },
    secret
  );
  const UserDetails: UserDetails = {
    id: user.id,
    username:user.username!,
    name: user.name!,
    profile:user.profile!,
    email:user.email,
    rating:user.rating,
    token: token,
    isGuest: false,
  };
  res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
  res.json(UserDetails);
});

//post as guest

router.post("/signUpGuest", async (req: Request, res: Response) => {
  const bodyData = req.body;
  console.log(req.body);
  let guestUUID = "guest-" + uuidv4();

  const user = await prisma.user.create({
    data: {
      username: guestUUID,
      email: guestUUID + "@chess100x.com",
      rating:500,
      name: bodyData.name || guestUUID,
      provider: "GUEST",
    },
  });
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = jwt.sign(
    { userId: user.id, name: user.name, rating:user.rating,profile:user.profile },
    secret
  );
  const UserDetails: UserDetails = {
    id: user.id,
    username:user.username!,
    name: user.name!,
    profile:user.profile!,
    email:user.email,
    rating:user.rating,
    token: token,
    isGuest: false,
  };
  res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 });
  res.json(UserDetails);
});

//handle google login callback

router.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: "failure" }).redirect("/");
});

// logout player form game

router.post("/logout", (req: Request, res: Response) => {
  console.log("hello");
  
  res.clearCookie("token");
  res.status(200).json({
    success: false,
    message: "User successfully logged Out",
  });
});

export default router;
