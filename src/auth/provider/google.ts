import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import * as z from "zod";
import { dbGetOrCreateGoogleUser } from "@/db/relational/functions/user";
import { setCorrectToken } from "@/auth/helper";
import { User } from "next-auth";
const googleProfileSchema = z.object({
  aud: z.string(),
  azp: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  exp: z.number(),
  family_name: z.string(),
  given_name: z.string(),
  hd: z.string(),
  iat: z.number(),
  iss: z.string(),
  jti: z.string(),
  name: z.string(),
  nbf: z.number(),
  picture: z.string(),
  sub: z.string(),
});

export async function handleSignInGoogleCallback({
  account,
  profile,
}: {
  account: Account;
  profile: Profile | undefined;
}) {
  const googleProfile = googleProfileSchema.parse(profile);
  const _context = await dbGetOrCreateGoogleUser(googleProfile, account);
  const { success, response: user1 } = await _context?.json();
  return success;
}
