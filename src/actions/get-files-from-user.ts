"use server";
import { db } from "@/database/relational/connection";
import { eq } from "drizzle-orm";
import { files } from "@/database/relational/schema";
import { type File } from "@/util/hooks/use-user-files";

type Response = {
  files: Array<File>;
  hasError: boolean;
};
export async function getFilesFromUser(userId: string): Promise<Response> {
  try {
    const userFiles = await db
      .select({
        file_id: files.file_id,
        file_name: files.file_name,
      })
      .from(files)
      .where(eq(files.user_id, userId));
    const isError = userFiles.length === 0;

    return {
      files: userFiles,
      hasError: isError,
    };
  } catch (error) {
    console.error(error);
    return {
      files: [],
      hasError: true,
    };
  }
}
