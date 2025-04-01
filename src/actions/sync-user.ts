"use server";
import * as z from "zod";
import { userTable } from "@/db/relational/schema";
import db from "@/db/relational/connection";
import { eq } from "drizzle-orm";

const userSchema = z.object({
  userId: z.string(),
  username: z.string().optional(),
  email: z.string(),
});
export async function syncUser(
  userId: string,
  username: string | null,
  email: string,
) {
  try {
    if (!userId || !email || !username) {
      throw new Error("Invalid user data");
    }
    const userData = userSchema.parse({ userId, username, email });

    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.user_id, userData.userId));

    if (existingUser.length > 0) {
      return { success: false, response: "User already exists" };
    } else {
      await db
        .update(userTable)
        .set({
          username: userData.username!,
          email: userData.email,
        })
        .where(eq(userTable.user_id, userData.userId));
      return { success: true, response: userData.userId };
    }
  } catch (error) {
    console.error("Error syncing error", error);
    return {
      success: false,
      response: (error as Error).message,
    };
  }
}
