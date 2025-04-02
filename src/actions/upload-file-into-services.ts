"use server";

import db from "@/db/relational/connection";
import { filesTable } from "@/db/relational/schema";
import { AWSService } from "@/util/aws/aws-service";
import { generateEmbedding } from "@/util/openai-service/embedding-service";
import { upsertEmbedding } from "@/db/vector/pinecone-service";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { v4 as uuidv4 } from "uuid";
import { getChunkedTextFromFile } from "@/db/vector/util/chunk-text";

export type Category = "Technical Document" | "News Article";

export async function uploadFileToDatabaseAndS3(file: File) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const response = await uploadFileToS3(user.id, file);
    if (!response.success) {
      throw new Error(response.message);
    }
    const awsFileKey = response.fileKey;
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileId = uuidv4();
    const userId = user.id;

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

async function uploadFileToS3(userId: string, file: File) {
  const awsService = new AWSService(userId);
  try {
    const awsFileKey = await awsService.uploadFileToS3(file);
    return { success: true, fileKey: awsFileKey };
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return { success: false, message: (error as Error).message };
  }
}

export async function uploadFileAcrossServices(file: File) {
  try {
    const uploadResult = await uploadFileToDatabaseAndS3(file);
    if (!uploadResult.success) {
      throw new Error("Failed to upload file to the database");
    }
    await uploadFileEmbeddingToPinecone(
      file,
      uploadResult.userId!,
      uploadResult.fileId!,
      uploadResult.awsFileKey!,
    );

    return {
      success: true,
      fileData: {
        userId: uploadResult.userId!,
        fileId: uploadResult.fileId!,
        title: uploadResult.fileName,
      },
    };
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
    console.debug("Chunks", chunks);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(chunks, embeddings, fileId, userId);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
