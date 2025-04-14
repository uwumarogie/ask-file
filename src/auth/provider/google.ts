import { Account, Profile } from "next-auth";
import { googleProfileSchema } from "./schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleProfile } from "next-auth/providers/google";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import { generateUUID } from "@/util/uuid";
import db from "@/db/relational/connection";

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
      const userId = generateUUID();

      await db.transaction(async (tx) => {
        await tx.insert(userTable).values({
          id: userId,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
        });

        await tx.insert(accountTable).values({
          userId: userId,
          type: "oauth",
          providerAccountId: googleProfile.sub,
          provider: "google",
          access_token: googleProfile.access_token,
          refresh_token: googleProfile.refresh_token,
          expires_at: googleProfile.expires_at,
          token_type: googleProfile.token_type,
          scope: googleProfile.scope,
          id_token: googleProfile.id_token,
          session_state: googleProfile.session_state,
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
export async function handleSignInGoogleCallback({
  account,
  profile,
}: {
  account: Account;
  profile: Profile | undefined;
}) {
  const googleProfile = googleProfileSchema.parse(profile);
  const _context = await dbGetOrCreateGoogleUser(googleProfile, account);
  const { success } = await _context?.json();
  return success;
}
