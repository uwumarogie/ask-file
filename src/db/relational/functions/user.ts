"use server";
import db from "@/db/relational/connection";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import type { GitHubProfile } from "next-auth/providers/github";
import { Account } from "next-auth";
import { generateUUID } from "@/util/uuid";
import { auth } from "@/auth";

export async function getUser() {
  try {
    const userInformation = await auth();
    console.debug("userInformation", userInformation?.user?.id);
    if (userInformation == undefined || userInformation == null) {
      throw new Error("User not authenticated");
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, userInformation?.user?.email!));

    return user;
  } catch (error) {
    console.error("Error getting user by id", error);
    throw new Error("Error getting user by id");
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
      .where(
        and(
          eq(userTable.name, profile.name!),
          eq(userTable.email, profile.email!),
        ),
      );

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
