"use server";

import { db } from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { AWSUploader } from "@/util/aws-file-uploader";
import { eq } from "drizzle-orm";
import { generateEmbedding } from "@/util/openai-service/embedding-service";
import { upsertEmbedding } from "@/database/vector/index";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { v4 as uuidv4 } from "uuid";
import { getChunkedTextFromFile } from "@/database/vector/util/chunk-text";

export type Category = "Technical Document" | "News Article";

export async function insertFileData(file: File) {
  try {
    const user = await currentUser();

    if (user === null) {
      throw new Error("The user is null");
    }
    const alreadyFileInDatabase = await db
      .select()
      .from(files)
      .where(eq(files.file_name, file.name));

    if (alreadyFileInDatabase.length > 0) {
      throw new Error("File already exists in database");
    }

    const fileKey = await new AWSUploader(user.id).uploadFile(file);

    const sanitizedFileName = sanitizeFileName(file.name);
    const fileId = uuidv4();
    await db.insert(files).values({
      file_id: fileId,
      user_id: user.id,
      file_name: sanitizedFileName,
      file_path: fileKey,
    });
    await uploadFileEmbeddingToPinecone(file, user.id, fileId, fileKey);
    return { success: true, response: fileId };
  } catch (error) {
    console.error(error);
    return { success: false, response: error };
  }
}

async function uploadFileEmbeddingToPinecone(
  file: File | null,
  userId: string,
  fileId: string,
  fileKey: string,
) {
  try {
    const chunks = await getChunkedTextFromFile(file, fileKey);
    //const embeddings = await generateEmbedding(chunks);
    //const response = await upsertEmbedding(chunks, embeddings, fileId, userId);
    // return response;
    return "";
  } catch (error) {
    console.error(error);
    throw error;
  }
}
