"use server";
import db from "@/db/relational/connection";
import { eq, and, desc } from "drizzle-orm";
import { filesTable, userTable } from "@/db/relational/schema";
import { getFiletype } from "@/util/file-modification/util";
import { sanitizeFileName } from "@/util/file-modification/util";
import { v4 as uuidv4 } from "uuid";

export type DocumentCard = {
  id: string;
  title: string;
  fileType: string | undefined;
  createdAt: Date;
  isFavorite: boolean;
};

type GetFilesResult = {
  success: boolean;
  response: Array<DocumentCard> | string;
};
export async function dbCheckExistingFile(fileName: string): Promise<boolean> {
  const user = null;
  if (!user) {
    throw new Error("User not authenticated");
  }
  console.debug("user", user);

  const dbUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.user_id, "tets"));

  return (
    (
      await db
        .select()
        .from(filesTable)
        .where(
          and(
            eq(filesTable.file_name, fileName),
            eq(filesTable.user_id, dbUser[0].user_id),
          ),
        )
    ).length > 0
  );
}

export async function dbGetFiles(): Promise<GetFilesResult> {
  try {
    const user = null;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userFiles = await db
      .select({
        file_id: filesTable.file_id,
        file_name: filesTable.file_name,
        file_path: filesTable.file_path,
        created_at: filesTable.created_at,
        favorite: filesTable.isFavorite,
      })
      .from(filesTable)
      .where(eq(filesTable.user_id, "test"))
      .orderBy(desc(filesTable.updated_at));

    const anyFilesAvailable = userFiles.length === 0;

    if (anyFilesAvailable) {
      return { success: false, response: "No files found" };
    }
    const response = userFiles.map((file) => {
      return {
        id: file.file_id,
        title: file.file_name,
        fileType: getFiletype(file.file_path),
        createdAt: file.created_at,
        isFavorite: file.favorite,
      };
    });

    return {
      success: true,
      response: response,
    };
  } catch (error) {
    console.error("Error fetching files, error");
    return {
      success: false,
      response: "Error fetching files, error",
    };
  }
}

export async function dbCreateFile(
  file: File,
  userId: string,
  fileKey: string | undefined,
) {
  try {
    const awsFileKey = fileKey;
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileId = uuidv4();

    //TODO: Add thumbnail path
    await db.insert(filesTable).values({
      file_id: fileId,
      user_id: userId,
      file_name: sanitizedFileName,
      file_path: awsFileKey!,
    });

    return {
      success: true,
      userId,
      fileId,
      fileName: sanitizedFileName,
      awsFileKey: awsFileKey!,
      filePath: fileId,
    };
  } catch (error) {
    console.error("Error uploading file to database", error);
    return { success: false, error };
  }
}
