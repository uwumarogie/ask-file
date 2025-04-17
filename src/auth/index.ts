import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Github from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/relational/connection";
import { dbGetUserById } from "@/db/relational/functions/user";
import { handleSignInGoogleCallback } from "./provider/google";
import { handleSignInAppleCallBack } from "./provider/apple";
import { handleSignInGithubCallback } from "./provider/github";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import type { Account, Profile, NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

const SESSION_LIFETIME = 60 * 60 * 8;

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
  Apple({
    clientId: process.env.AUTH_APPLE_ID!,
    clientSecret: process.env.AUTH_APPLE_SECRET!,
  }),
  Github({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
];

const adapter = DrizzleAdapter(db, {
  usersTable: userTable,
  accountsTable: accountTable,
});
const pages = {
  signIn: "/sign-in",
  error: "/sign-in",
};

const session = {
  strategy: "jwt",
  maxAge: SESSION_LIFETIME,
};

const callbacks = {
  async signIn({ account, profile }: { account: Account; profile: Profile }) {
    if (account?.provider === "google") {
      return await handleSignInGoogleCallback({ account, profile });
    } else if (account?.provider === "apple") {
      return await handleSignInAppleCallBack({ account, profile });
    } else if (account?.provider === "github") {
      return await handleSignInGithubCallback({ account, profile });
    }
  },
  async jwt({ token }: { token: JWT }) {
    return token;
  },
  async session({ session, user }: { session: Session; user: User }) {
    console.debug("session", session);
    console.debug("user", user);
    // const userId = user.id;
    // if (userId === undefined || userId == null) return session;
    // const dbUser = await dbGetUserById(userId);
    // if (dbUser === undefined) {
    //   throw new Error(`Could not find user with id ${userId}`);
    // }
    // session.user = dbUser;
    return session;
  },
};

const debug = true;

export const authOptions = {
  adapter,
  providers,
  debug,
  pages,
  session,
  callbacks,
} as NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth({ ...authOptions });
