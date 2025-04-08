"use server";
import db from "@/db/relational/connection";
import { userTable } from "@/db/relational/schema/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleProfile } from "next-auth/providers/google";
import { AppleProfile } from "next-auth/providers/apple";
import { GithubProfile } from "next-auth/providers/github";
import { Account } from "next-auth";
export async function createUser() {
  try {
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
      response: (error as Error).message,
    });
  }
}

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

export async function dbGetOrCreateGoogleUser(
  googleProfile: GoogleProfile,
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
      .where(eq(userTable.id, account.userId!));

    if (user === undefined || user === null) {
      const user = await db.insert(userTable).values({
        id: account.id as string,
        name: googleProfile.name,
        email: googleProfile.email,
        image: googleProfile.picture,
      });

      return NextResponse.json({
        success: true,
        response: user,
      });
    }
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
      response: (error as Error).message,
    });
  }
}

export async function dbGetOrCreateAppleUser(
  appleProfile: AppleProfile,
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
      .where(eq(userTable.id, account.userId!));

    if (user === undefined || user === null) {
      const user = await db.insert(userTable).values({
        id: account.id as string,
        email: appleProfile.email,
      });

      return NextResponse.json({
        success: true,
        response: user,
      });
    }
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
      response: (error as Error).message,
    });
  }
}

export async function dbGetOrCreateGithubUser(
  githubProfile: GithubProfile,
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
      .where(eq(userTable.id, account.userId!));

    if (user === undefined || user === null) {
      const user = await db.insert(userTable).values({
        id: account.id as string,
        name: githubProfile.name,
        email: githubProfile.email,
      });

      return NextResponse.json({
        success: true,
        response: user,
      });
    }
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json({
      success: false,
      response: (error as Error).message,
    });
  }
}
