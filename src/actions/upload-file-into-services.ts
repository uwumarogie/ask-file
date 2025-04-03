"use server";
import { currentUser } from "@clerk/nextjs/server";
import { uploadFileToS3 } from "@/util/aws/service-interaction";
import { uploadFileEmbeddingToPinecone } from "@/db/vector/functions/file";
import { dbCreateFile } from "@/db/relational/functions/files";
import { NextResponse } from "next/server";

export type Category = "Technical Document" | "News Article";

export async function uploadFileAcrossServices(file: File) {
  try {
    const user = await currentUser();
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
        userId: uploadResult.userId!,
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
