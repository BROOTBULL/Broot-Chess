import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from "./db";
import { Request } from "express";

export function initPassport() {
  if (
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.JWT_SECRET
  ) {
    throw new Error("Missing env vars for authentication provider");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://broot-chess-backend.onrender.com/auth/google/callback",
        passReqToCallback: true,
      },
      async function (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not found in Google profile"));
        }

        try {
          const user = await prisma.user.upsert({
            create: {
              email,
              username: profile.displayName,
              name: profile.displayName,
              profile: profile._json.picture,
              provider: "GOOGLE",
            },
            update: {
              name: profile.displayName,
            },
            where: {
              email,
            },
          });

          const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
          );

          req.res?.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

          req.res?.redirect("http://localhost:5173/home"); // <-- replace this
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
