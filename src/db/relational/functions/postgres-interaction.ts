"use server";
import { eq, and } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema";
import db from "@/db/relational/connection";

export async function dbDeleteFile(sanitizedFileName: string, userId: string) {
  try {
    const existingFiles = await db
      .select()
      .from(filesTable)
      .where(
        and(
          eq(filesTable.file_name, sanitizedFileName),
          eq(filesTable.user_id, userId),
        ),
      );

    if (existingFiles.length === 0) {
      throw new Error("File does not exist");
    }

    await db
      .delete(filesTable)
      .where(
        and(
          eq(filesTable.file_name, sanitizedFileName),
          eq(filesTable.user_id, userId),
        ),
      );
    return { success: true, fileId: existingFiles[0].file_id };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}
