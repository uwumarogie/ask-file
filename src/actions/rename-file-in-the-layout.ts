"use server";

import db from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { eq, and } from "drizzle-orm";

export async function renameFile(
  newName: string,
  fileId: string,
  userId?: string,
) {
  if (newName.length === 0) {
    return { success: false, response: "File name cannot be empty" };
  }
  if (!userId) {
    return { success: false, response: "User not authenticated" };
  }
  try {
    await db
      .update(files)
      .set({ file_description: newName })
      .where(and(eq(files.file_id, fileId), eq(files.user_id, userId)));

    return { success: true, response: newName };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as Error).message };
  }
}
