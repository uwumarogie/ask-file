import { Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import * as z from "zod";
import { dbGetOrCreateAppleUser } from "@/db/relational/functions/user";
import { setCorrectToken } from "@/auth/helper";

const appleProfileSchema = z.object({
  iss: z.literal("https://appleid.apple.com"),
  aud: z.string(),
  iat: z.number(),
  exp: z.number(),
  sub: z.string(),
  nonce: z.string(),
  nonce_supported: z.boolean(),
  email: z.string(),
  email_verified: z.union([z.literal("true"), z.literal(true)]),
  is_private_email: z.union([
    z.literal("true"),
    z.literal("false"),
    z.boolean(),
  ]),
  real_user_status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  transfer_sub: z.string(),
  at_hash: z.string(),
  auth_time: z.number(),
});

export async function handleSignInAppleCallBack({
  account,
  profile,
  token,
}: {
  account: Account;
  profile: Profile | undefined;
  token: JWT;
}) {
  const parseAppleProfile = appleProfileSchema.parse(profile);
  const _context = await dbGetOrCreateAppleUser(parseAppleProfile, account);
  const { success, response: user } = await _context?.json();
  return success ? setCorrectToken(user, token, account) : token;
}
