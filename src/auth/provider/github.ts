import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";
import { githubProfileSchema } from "./schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GitHubProfile } from "next-auth/providers/github";
import { userTable, accountTable } from "@/db/relational/schema/auth";
import { generateUUID } from "@/util/uuid";
import db from "@/db/relational/connection";

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
export async function handleSignInGithubCallback({
  account,
  profile,
}: {
  account: Account;
  profile: Profile | undefined;
}): Promise<JWT> {
  const parseGithubProfile = githubProfileSchema.parse(profile);
  const _context = await dbGetOrCreateGithubUser(parseGithubProfile, account);
  const { success } = await _context?.json();
  return success;
}
