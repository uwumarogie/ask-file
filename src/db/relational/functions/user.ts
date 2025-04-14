"use server";
import db from "@/db/relational/connection";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleProfile } from "next-auth/providers/google";
import { AppleProfile } from "next-auth/providers/apple";
import type { GitHubProfile } from "next-auth/providers/github";
import { Account } from "next-auth";
import { generateUUID } from "@/util/uuid";

export async function dbGetUserById(userId: string) {
  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));
    return user;
  } catch (error) {
    console.error("Error getting user by id", error);
    return undefined;
  }
}

export async function dbGetOrCreateGithubUser(
  profile: GitHubProfile,
  account: Account,
) {
  try {
    if (account === undefined || account == null) {
      return NextResponse.json({
        success: false,
        response: "Account is undefined",
      });
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.name, profile.name!));

    if (user === undefined || user === null) {
      const userId = generateUUID();

      await db.transaction(async (tx) => {
        await tx.insert(userTable).values({
          id: userId,
          name: profile.name,
          email: profile.email,
        });

        await tx.insert(accountTable).values({
          userId: userId,
          type: "oauth",
          provider: "github",
          providerAccountId: account.providerAccountId,
          refresh_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: "logged in",
        });
      });

      return NextResponse.json({
        success: true,
      });
    }
    return NextResponse.json({
      success: true,
      response: "User already exists",
    });
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
    });
  }
}
