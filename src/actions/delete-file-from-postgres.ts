"use server";
import db from "@/db/relational/connection";
import { filesTable } from "@/db/relational/schema";
import { and, eq } from "drizzle-orm";

export async function deleteFileFromDatabase(
  sanitizedFileName: string,
  userId: string,
) {
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

    console.debug("existingFiles", existingFiles);
    return { success: true, fileId: existingFiles[0].file_id };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
