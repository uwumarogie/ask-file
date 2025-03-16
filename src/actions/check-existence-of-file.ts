"use server";

import db from "@/database/relational/connection";
import { eq, and } from "drizzle-orm";
import { files } from "@/database/relational/schema";

import { currentUser } from "@clerk/nextjs/server";
export async function checkExistingFileName(
  fileName: string,
): Promise<{ success: boolean; response: boolean }> {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }
    console.debug("fileName in the server", fileName);
    const checkExistingFile = await db
      .select()
      .from(files)
      .where(and(eq(files.file_name, fileName), eq(files.user_id, user.id)));

    console.debug("checkExistingFile in the server", checkExistingFile);
    return { success: true, response: checkExistingFile.length > 0 };
  } catch (error) {
    console.error("Error checking file name:", error);
    throw error;
  }
}
