import { Account, Profile } from "next-auth";
import { appleProfileSchema } from "./schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { AppleProfile } from "next-auth/providers/apple";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import { generateUUID } from "@/util/uuid";
import db from "@/db/relational/connection";

export async function dbGetOrCreateAppleUser(
  profile: AppleProfile,
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
      const userId = generateUUID();
      await db.transaction(async (tx) => {
        await tx.insert(userTable).values({
          id: userId,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        });

        await tx.insert(accountTable).values({
          userId: userId,
          type: "oauth",
          provider: "apple",
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
        response: "User created",
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
      response: (error as Error).message,
    });
  }
}

export async function handleSignInAppleCallBack({
  account,
  profile,
}: {
  account: Account;
  profile: Profile | undefined;
}) {
  const parseAppleProfile = appleProfileSchema.parse(profile);
  const _context = await dbGetOrCreateAppleUser(parseAppleProfile, account);
  const { success } = await _context?.json();
  return success;
}
