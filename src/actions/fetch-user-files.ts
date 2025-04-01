"use server";
import db from "@/db/relational/connection";
import { desc, eq } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema";
import { type File } from "@/util/hooks/use-user-files";
import { currentUser } from "@clerk/nextjs/server";
type FetchUserFilesResult = {
  files: Array<File>;
  hasError: boolean;
};

const mockDocuments = [
  {
    id: "1",
    title: "Technical Specification v1.0",
    fileType: "PDF",
    createdAt: new Date("2023-10-15"),
    isFavorite: true,
  },

  {
    id: "2",
    title: "System Architecture Overview",
    fileType: "PDF",
    createdAt: new Date("2023-10-05"),
    isFavorite: true,
  },
  {
    id: "3",
    title: "Project Requirements Document",
    fileType: "PDF",
    createdAt: new Date("2023-08-20"),
    isFavorite: false,
  },
];

export async function fetchUserFiles(): Promise<FetchUserFilesResult> {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userFiles = await db
      .select({
        file_id: filesTable.file_id,
        file_name: filesTable.file_name,
        file_path: filesTable.file_path,
        created_at: filesTable.created_at,
      })
      .from(filesTable)
      .where(eq(filesTable.user_id, user.id))
      .orderBy(desc(filesTable.updated_at));

    const isEmpty = userFiles.length === 0;

    return {
      files: userFiles,
      hasError: isEmpty,
    };
  } catch (error) {
    console.error("Error fetching files, error");
    return {
      files: [],
      hasError: true,
    };
  }
}
