import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "@/models/user";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails[0]?.value) {
          return done(new Error('No email found from Google profile'));
        }

        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
          });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
          expiresIn: "1h",
        });

        done(null, { token });
      } catch (error) {
        done(error as Error);
      }
    }
  )
);
