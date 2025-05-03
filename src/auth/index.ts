import db from "@/db/relational/connection";
import * as schema from "@/db/relational/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { hash, verify } from "@/util/crypto";

// TODO:  set requireEmailVerification to true and add the entire verification process
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "pg",
    debugLogs: true,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 3600,
    password: {
      hash: async (password) => {
        return hash(password);
      },
      verify: async ({ hash, password }) => {
        return verify({ hash, password });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          email: profile.email ? profile.email : "test@test.com",
        };
      },
    },
  },
  plugins: [nextCookies()],
});
