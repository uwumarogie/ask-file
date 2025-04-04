import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/relational/connection";
import {
  userTable,
  accountTable,
  sessionsTable,
  verificationTokensTable,
} from "@/db/relational/schema/auth";

const SESSION_LIFETIME = 60 * 60 * 8;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accountTable,
    sessionsTable: sessionsTable,
    verificationTokensTable: verificationTokensTable,
  }),
  providers: [
    GoogleProvider({
      clientId: "",
      clientSecret: "",
    }),
    AppleProvider({
      clientId: "",
      clientSecret: "",
    }),
    GithubProvider({
      clientId: "",
      clientSecret: "",
    }),
  ],
  pages: {
    signIn: "/(unauth)/login",
    error: "/(unauth)/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_LIFETIME,
  },
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (trigger === "signIn") {
        return await handleSignInCallback(account, profile, token);
      }
      return token;
    },
    async session({ session, token, user }) {
      const userId = user.id;
      if (userId === undefined || userId == null) return session;
      const dbUser = await dbGetUserById(userId);
      if (dbUser === undefined) {
        throw new Error(`Could not find user with id ${userId}`);
      }
      session.user = dbUser;
      return session;
    },
  },
  events: {
    async signOut(message: any) {
      if ("session" in message) return;

      const token = message.token;
      if (token == null) return;
      const possibleIdToken = token.id_token as string | undefined;
      if (possibleIdToken !== undefined) {
        await handleSignOutCallbakc({ token: possibleIdToken });
      }
      return undefined;
    },
  },
});
