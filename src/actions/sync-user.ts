"use server";
import * as z from "zod";
import { user } from "@/database/relational/schema";
import { db } from "@/database/relational/connection";

const userSchema = z.object({
  userId: z.string(),
  username: z.string().optional(),
  email: z.string(),
});
export async function syncUser(
  userId?: string,
  username?: string | null,
  email?: string,
) {
  try {
    const _context = userSchema.parse({ userId, username, email });
    await db.insert(user).values({
      user_id: _context.userId,
      username: _context.username!,
      email: _context.email,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
