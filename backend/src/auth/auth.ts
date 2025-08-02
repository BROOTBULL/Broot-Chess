import { Request, Response, Router } from "express";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "./verifyToken";
import bcrypt from "bcrypt"; 


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
  const { email, password } = req.body;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required." });
    return ;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ success: false, message: "User not found." });
      return ;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      res.status(401).json({ success: false, message: "Incorrect password." });
      return ;
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, rating: user.rating, profile: user.profile },
      secret,
      { expiresIn: "1d" }
    );

    const userDetails: UserDetails = {
      id: user.id,
      username: user.username!,
      name: user.name!,
      email: user.email!,
      profile: user.profile!,
      rating: user.rating,
      token,
      isGuest: false,
    };

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json(userDetails);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
  try {
    const bodyData = req.body;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Check for required fields
    if (!bodyData.email || !bodyData.password || !bodyData.username) {
       res.status(400).json({ message: "Email, username, and password are required." });
       return
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: bodyData.email },
    });

    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists." });
    return 
  }

    // Hash the password
    const hashedPassword = await bcrypt.hash(bodyData.password, 10);

    let guestUUID = "guest-" + uuidv4();

    const user = await prisma.user.create({
      data: {
        username: bodyData.username,
        email: bodyData.email,
        profile: bodyData.profile,
        name: bodyData.username || guestUUID,
        rating: 500,
        password: hashedPassword,
        provider: "EMAIL",
      },
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name, rating: user.rating, profile: user.profile },
      secret,
      { expiresIn: "1d" }
    );

    const UserDetails: UserDetails = {
      id: user.id,
      username: user.username!,
      name: user.name!,
      profile: user.profile!,
      email: user.email!,
      rating: user.rating,
      token,
      isGuest: false,
    };

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json(UserDetails);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong during sign up." });
  }
});

//post as guest

router.post("/signUpGuest", async (req: Request, res: Response) => {
  const bodyData = req.body;
  //console.log(req.body);
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
  //console.log("hello");
  
  res.clearCookie("token");
  res.status(200).json({
    success: false,
    message: "User successfully logged Out",
  });
});

export default router;
