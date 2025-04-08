import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";
import * as z from "zod";
import { dbGetOrCreateGithubUser } from "@/db/relational/functions/user";
import { setCorrectToken } from "@/auth/helper";
const githubProfileSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().nullable(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  blog: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  hireable: z.boolean().nullable(),
  bio: z.string().nullable(),
  twitter_username: z.string().nullable(),
  public_repos: z.number(),
  public_gists: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  private_gists: z.number(),
  total_private_repos: z.number(),
  owned_private_repos: z.number(),
  disk_usage: z.number(),
  suspended_at: z.string().nullable(),
  collaborators: z.number(),
  two_factor_authentication: z.boolean(),
  plan: z.object({
    collaborators: z.number(),
    name: z.string(),
    space: z.number(),
    private_repos: z.number(),
  }),
});

export async function handleSignInGithubCallback({
  account,
  profile,
  token,
}: {
  account: Account;
  profile: Profile | undefined;
  token: JWT;
}): Promise<JWT> {
  const parseGithubProfile = githubProfileSchema.parse(profile);
  const _context = await dbGetOrCreateGithubUser(parseGithubProfile, account);
  const { success, response: user } = await _context?.json();
  return success ? setCorrectToken(user, token, account) : token;
}
