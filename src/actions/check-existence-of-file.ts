"use server";

import db from "@/database/relational/connection";
import { eq } from "drizzle-orm";
import { files } from "@/database/relational/schema";

export async function checkExistingFileName(
  fileName: string,
): Promise<{ success: boolean; response: boolean }> {
  try {
    console.debug("fileName in the server", fileName);
    const checkExistingFile = await db
      .select()
      .from(files)
      .where(eq(files.file_name, fileName));

    console.debug("checkExistingFile in the server", checkExistingFile);
    return { success: true, response: checkExistingFile.length > 0 };
  } catch (error) {
    console.error("Error checking file name:", error);
    throw error;
  }
}
