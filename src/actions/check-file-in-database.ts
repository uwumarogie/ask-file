"use server";

import db from "@/db/relational/connection";
import { filesTable } from "@/db/relational/schema";
import { eq, and } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";

export async function checkFileInDatabase(fileName: string) {
  const user = await currentUser();
  if (user === null || user === undefined) {
    throw new Error("User not found");
  }
  try {
    const sanitizedFileName = sanitizeFileName(fileName);
    const result = await db
      .select()
      .from(filesTable)
      .where(
        and(
          eq(filesTable.file_name, sanitizedFileName),
          eq(filesTable.user_id, user.id),
        ),
      );
    if (result.length > 0) {
      return { exist: true, fileId: result[0].file_id };
    } else {
      return { exist: false, fileId: null };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
