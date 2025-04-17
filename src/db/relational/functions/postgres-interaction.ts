"use server";
import { eq, and } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema/business";
import db from "@/db/relational/connection";
import { getUser } from "./user";
export async function dbDeleteFile(sanitizedFileName: string) {
  try {
    const user = await getUser();
    const existingFiles = await db
      .select()
      .from(filesTable)
      .where(
        and(
          eq(filesTable.fileName, sanitizedFileName),
          eq(filesTable.userId, user.id),
        ),
      );

    if (existingFiles.length === 0) {
      throw new Error("File does not exist");
    }

    await db
      .delete(filesTable)
      .where(
        and(
          eq(filesTable.fileName, sanitizedFileName),
          eq(filesTable.userId, user.id),
        ),
      );
    return { success: true, fileId: existingFiles[0].fileId };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
}
