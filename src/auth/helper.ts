import { JWT } from "next-auth/jwt";
import { UserModel } from "@/db/relational/schema/auth";
import { Account } from "next-auth";

export function setCorrectToken(
  user: UserModel,
  token: JWT,
  account: Account,
): JWT {
  token.userId = user.id;
  token.email = user.email;
  token.id_token = account.id_token;
  return token;
}

export async function handleSignOutCallback(params: {
  token: string;
}): Promise<void> {}
