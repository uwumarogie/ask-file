"use server";
import db from "@/db/relational/connection";
import { eq, and, desc } from "drizzle-orm";
import { filesTable } from "@/db/relational/schema/business";
import { getFiletype } from "@/util/file-modification/util";
import { sanitizeFileName } from "@/util/file-modification/util";
import { generateUUID } from "@/util/uuid";
import { getUser } from "./user";
import { uploadFileToS3 } from "@/util/aws/service-interaction";
import { uploadFileEmbeddingToPinecone } from "@/db/vector/functions/file";
import { NextResponse } from "next/server";
import { postConversationStart } from "./chat";

export type DocumentCardType = {
  id: string;
  title: string;
  fileType: string | undefined;
  createdAt: Date;
  isFavorite: boolean;
};

type GetFilesResult = {
  success: boolean;
  response: Array<DocumentCardType>;
};

export type Category = "Technical Document" | "News Article";

export async function dbCheckExistingFile(fileName: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    return (
      (
        await db
          .select()
          .from(filesTable)
          .where(
            and(
              eq(filesTable.fileName, fileName),
              eq(filesTable.userId, user.id),
            ),
          )
      ).length > 0
    );
  } catch (error) {
    console.error("Error checking file name:", error);
    return false;
  }
}

export async function dbGetFiles(): Promise<GetFilesResult> {
  try {
    const user = await getUser();
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
      .where(eq(filesTable.userId, user.id))
      .orderBy(desc(filesTable.updatedAt));

    const anyFilesAvailable = userFiles.length === 0;

    if (anyFilesAvailable) {
      return { success: false, response: [] };
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
    console.error("Error fetching files, error", error);
    return {
      success: false,
      response: [],
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

export async function uploadFileAcrossServices(file: File) {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    // UPLOAD FILE TO S3
    const response = await uploadFileToS3(user.id, file);
    if (!response.success) {
      throw new Error(response.message);
    }

    // UPLOAD FILE TO POSTGRES
    const uploadResult = await dbCreateFile(file, user.id, response.fileKey);
    if (!uploadResult.success) {
      throw new Error("Failed to upload file to the database");
    }

    // UPLOAD FILE TO PINECONE
    await uploadFileEmbeddingToPinecone(
      file,
      uploadResult.userId!,
      uploadResult.fileId!,
      uploadResult.awsFileKey!,
    );

    return NextResponse.json({
      success: true,
      fileData: {
        fileId: uploadResult.fileId!,
        title: uploadResult.fileName,
      },
    });
  } catch (error) {
    console.error("Error uploading file across services", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

export async function uploadFile(
  file: File | null,
): Promise<string | undefined> {
  if (!file) return;

  try {
    const exists = await dbCheckExistingFile(file.name);
    if (exists) {
      throw new Error("File already exists");
    }

    const uploadCtx = await uploadFileAcrossServices(file);
    const uploadJson = await uploadCtx.json();
    if (!uploadJson?.success || !uploadJson.fileData) {
      throw new Error("Failed to upload file");
    }

    const { fileId, title } = uploadJson.fileData;
    const conversationResponse = await postConversationStart(fileId, title);
    if (!conversationResponse.success) {
      throw new Error(
        `Failed to initialize chat entry: ${conversationResponse.error}`,
      );
    }

    return conversationResponse.conversationId;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error("Upload Error");
  }
}

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
