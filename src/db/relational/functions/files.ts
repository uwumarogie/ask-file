"use server";
import db from "@/db/relational/connection";
import { eq, and, desc } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema/business";
import { userTable } from "@/db/relational/schema/auth";
import { getFiletype } from "@/util/file-modification/util";
import { sanitizeFileName } from "@/util/file-modification/util";
import { generateUUID } from "@/util/uuid";
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
    .where(eq(userTable.id, "tets"));

  return (
    (
      await db
        .select()
        .from(filesTable)
        .where(
          and(
            eq(filesTable.fileName, fileName),
            eq(filesTable.userId, dbUser[0].id),
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
        fileId: filesTable.fileId,
        fileName: filesTable.fileName,
        filePath: filesTable.filePath,
        createdAt: filesTable.createdAt,
        favorite: filesTable.isFavorite,
      })
      .from(filesTable)
      .where(eq(filesTable.userId, "test"))
      .orderBy(desc(filesTable.updatedAt));

    const anyFilesAvailable = userFiles.length === 0;

    if (anyFilesAvailable) {
      return { success: false, response: "No files found" };
    }
    const response = userFiles.map((file) => {
      return {
        id: file.fileId,
        title: file.fileName,
        fileType: getFiletype(file.filePath),
        createdAt: file.createdAt,
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
    const fileId = generateUUID();

    //TODO: Add thumbnail path
    await db.insert(filesTable).values({
      fileId: fileId,
      userId: userId,
      fileName: sanitizedFileName,
      filePath: awsFileKey!,
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
