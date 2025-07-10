const GoogleStratdgy = require("passport-google-oauth20");
import passport from "passport";
import dotenv from "dotenv";
import prisma from "./db";

dotenv.config();

export function initPassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("missing enviroment variable for authantication provider");
  }

  passport.use(
    new GoogleStratdgy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        const user = await prisma.user.upsert({
          // update+insert
          create: {
            email: profile.emails[0].value,
            username: profile.displayName,
            name: profile.displayName,
            profile: profile._json.picture,
            provider: "GOOGLE",
          },
          update: {
            name: profile.displayName,
          },
          where: {
            email: profile.emails[0].value,
          },
        });

        done(null, user);
      }
    )
  );

  passport.serializeUser(function (user: any, cb) {
    //	Defines what user data gets stored in the session (e.g., just id)
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
        username: user.username,
        profile: user.profile,
      });
    });
  });

  passport.deserializeUser(function (user: any, cb) {
    //	Defines how to turn that stored data back into a full user object
    process.nextTick(function () {
      return cb(null, user);
    });
  });
}
