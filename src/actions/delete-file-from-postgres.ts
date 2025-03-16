"use server";
import db from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { and, eq } from "drizzle-orm";

export async function deleteFileFromDatabase(
  sanitizedFileName: string,
  userId: string,
) {
  try {
    const existingFiles = await db
      .select()
      .from(files)
      .where(
        and(eq(files.file_name, sanitizedFileName), eq(files.user_id, userId)),
      );

    if (existingFiles.length === 0) {
      throw new Error("File does not exist");
    }

    await db
      .delete(files)
      .where(
        and(eq(files.file_name, sanitizedFileName), eq(files.user_id, userId)),
      );

    console.debug("existingFiles", existingFiles);
    return { success: true, fileId: existingFiles[0].file_id };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
