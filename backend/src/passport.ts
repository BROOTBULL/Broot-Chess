const GoogleStrategy = require("passport-google-oauth20");
import passport from "passport";
import prisma from "./db";

export function initPassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing env vars for authentication provider");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://broot-chess-backend.onrender.com/auth/google/callback",
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Email not found in Google profile"));
        }

        try {
          const user = await prisma.user.upsert({
            create: {
              email: email,
              username: profile.displayName,
              name: profile.displayName,
              profile: profile._json.picture,
              provider: "GOOGLE",
            },
            update: {
              name: profile.displayName,
            },
            where: {
              email: email,
            },
          });

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
