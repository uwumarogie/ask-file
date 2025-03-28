"use server";

import db from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { AWSService } from "@/util/aws/aws-service";
import { generateEmbedding } from "@/util/openai-service/embedding-service";
import { upsertEmbedding } from "@/database/vector/pinecone-service";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { v4 as uuidv4 } from "uuid";
import { getChunkedTextFromFile } from "@/database/vector/util/chunk-text";

export type Category = "Technical Document" | "News Article";

export async function uploadFileToDatabase(file: File) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const awsService = new AWSService(user.id);
    const awsFileKey = await awsService.uploadFileToS3(file);
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileId = uuidv4();
    const userId = user.id;

    //TODO: Add thumbnail path
    await db.insert(files).values({
      file_id: fileId,
      user_id: userId,
      file_name: sanitizedFileName,
      file_path: awsFileKey,
    });

    return {
      success: true,
      userId,
      fileId,
      awsFileKey,
      filePath: fileId,
    };
  } catch (error) {
    console.error("Error uploading file to database", error);
    return { success: false, error };
  }
}

export async function uploadFileAcrossServices(file: File) {
  try {
    const uploadResult = await uploadFileToDatabase(file);
    if (!uploadResult.success) {
      throw new Error("Failed to upload file to the database");
    }
    await uploadFileEmbeddingToPinecone(
      file,
      uploadResult.userId!,
      uploadResult.fileId!,
      uploadResult.awsFileKey!,
    );

    return { success: true, filePath: uploadResult.fileId! };
  } catch (error) {
    console.error("Error uploading file across services", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function uploadFileEmbeddingToPinecone(
  file: File,
  userId: string,
  fileId: string,
  fileKey: string,
) {
  try {
    const chunks = await getChunkedTextFromFile(file, fileKey);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(chunks, embeddings, fileId, userId);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
