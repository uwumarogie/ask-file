"use server";
import db from "@/database/relational/connection";
import { desc, eq } from "drizzle-orm";
import { files } from "@/database/relational/schema";
import { type File } from "@/util/hooks/use-user-files";

type FetchUserFilesResult = {
  files: Array<File>;
  hasError: boolean;
};
export async function fetchUserFiles(
  userId: string,
): Promise<FetchUserFilesResult> {
  try {
    const userFiles = await db
      .select({
        file_id: files.file_id,
      })
      .from(files)
      .where(eq(files.user_id, userId))
      .limit(10)
      .orderBy(desc(files.updated_at));

    const isEmpty = userFiles.length === 0;

    return {
      files: userFiles,
      hasError: isEmpty,
    };
  } catch (error) {
    console.error("Error fetching files", error);
    return {
      files: [],
      hasError: true,
    };
  }
}
