import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./prisma";
import { AuthProvider, UserRole } from "@prisma/client";
import dbConfig from "./db.config";

// ----------------- LOCAL STRATEGY -----------------
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        // Include auths relation to check Google credentials
        const user = await prisma.user.findUnique({
          where: { email },
          include: { auths: true },
        });

        if (!user) return done("User does not exist");
        if (!user.isVerified) return done("User is not verified");

        const isGoogleAuthenticated =
          user.auths?.some((a) => a.provider === AuthProvider.GOOGLE) ?? false;

        return done(null, user);
      } catch (error) {
        console.error(error);
        done(error);
      }
    },
  ),
);

// ----------------- GOOGLE STRATEGY -----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: dbConfig.google.client_id as string,
      clientSecret: dbConfig.google.client_secret as string,
      callbackURL: dbConfig.google.redirect_uri as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: "No email found" });

        // Include auths relation
        let user = await prisma.user.findUnique({
          where: { email },
          include: { auths: true },
        });

        if (user && !user.isVerified)
          return done(null, false, { message: "User is not verified" });
        // If user doesn't exist, create a new one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName ?? "No Name",
              profileImage: profile.photos?.[0]?.value ?? null,
              role: UserRole.USER,
              isVerified: true,
              auths: {
                create: [
                  {
                    provider: AuthProvider.GOOGLE,
                    providerId: profile.id,
                  },
                ],
              },
            },
            include: { auths: true }, // Include auths for consistency
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error", error);
        return done(error);
      }
    },
  ),
);

// ----------------- SERIALIZE & DESERIALIZE -----------------
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { auths: true },
    });
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export default passport;
