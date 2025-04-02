"use server";

import db from "@/db/relational/connection";
import { eq, and } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema";

import { currentUser } from "@clerk/nextjs/server";
export async function checkExistingFileName(
  fileName: string,
): Promise<{ success: boolean; response: boolean }> {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }
    const checkExistingFile = await db
      .select()
      .from(filesTable)
      .where(
        and(
          eq(filesTable.file_name, fileName),
          eq(filesTable.user_id, user.id),
        ),
      );

    return { success: true, response: checkExistingFile.length > 0 };
  } catch (error) {
    console.error("Error checking file name:", error);
    throw error;
  }
}
