import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/relational/connection";
import { dbGetUserById } from "@/db/relational/functions/user";
import {
  userTable,
  accountTable,
  sessionsTable,
  verificationTokensTable,
} from "@/db/relational/schema/auth";
import { handleSignInGoogleCallback } from "./provider/google";
import { handleSignInAppleCallBack } from "./provider/apple";
import { handleSignInGithubCallback } from "./provider/github";
import type { Account, NextAuthOptions, Profile } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

const SESSION_LIFETIME = 60 * 60 * 8;

console.debug("GITHUB_CLIENT_ID", process.env.AUTH_GITHUB_ID);
const providers: Provider[] = [
  GoogleProvider({
    clientId: "öiwornwe",
    clientSecret: "rulköwnerw",
  }),
  AppleProvider({
    clientId: "ilewnrwe",
    clientSecret: "iöwemrowöämr",
  }),
  GithubProvider({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
];

export const providersMap = providers.map((provider) => {
  return { id: provider.id, name: provider.name };
});

const adapter = DrizzleAdapter(db, {
  usersTable: userTable,
  accountsTable: accountTable,
  sessionsTable: sessionsTable,
  verificationTokensTable: verificationTokensTable,
});
const pages = {
  signIn: "/login",
  error: "/login",
};

const session = {
  strategy: "jwt",
  maxAge: SESSION_LIFETIME,
};

const callbacks = {
  async signIn({
    account,
    profile,
  }: {
    user: User;
    account: Account;
    profile: Profile;
  }) {
    if (account?.provider === "google") {
      return await handleSignInGoogleCallback({ account, profile });
    } else if (account?.provider === "apple") {
      return await handleSignInAppleCallBack({ account, profile });
    } else if (account?.provider === "github") {
      console.log("GITHUB");
      return await handleSignInGithubCallback({ account, profile });
    }
  },
  async jwt({
    token,
    account,
    profile,
    trigger,
  }: {
    token: JWT;
    account: Account;
    profile: Profile;
    trigger: string;
  }) {
    return token;
  },
  async session({ session, user }: { session: Session; user: User }) {
    const userId = user.id;
    if (userId === undefined || userId == null) return session;
    const dbUser = await dbGetUserById(userId);
    if (dbUser === undefined) {
      throw new Error(`Could not find user with id ${userId}`);
    }
    session.user = dbUser;
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
} as NextAuthOptions;

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authOptions,
});
