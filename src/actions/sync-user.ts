"use server";
import * as z from "zod";
import { user } from "@/database/relational/schema";
import { db } from "@/database/relational/connection";
import { eq } from "drizzle-orm";

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
    if (!userId || !email || !username) {
      throw new Error("Invalid user data");
    }
    const _context = userSchema.parse({ userId, username, email });

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.user_id, _context.userId));

    if (existingUser.length > 0) {
      throw new Error("User already exists");
    } else {
      await db
        .insert(user)
        .values({
          user_id: _context.userId,
          username: _context.username!,
          email: _context.email,
        })
        .onConflictDoUpdate({
          target: user.username,
          set: {
            email: _context.email,
          },
        });
    }
    return { success: true, response: _context.userId };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      response: (error as Error).message,
    };
  }
}
