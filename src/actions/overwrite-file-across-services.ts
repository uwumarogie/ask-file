"use server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { AWSService } from "@/util/aws/aws-service";
import { deleteFileFromDatabase } from "@/actions/delete-file-from-postgres";
import { uploadFileToDatabaseAndS3 } from "@/actions/upload-file-into-services";
import { deleteEmbeddingFromPinecone } from "@/database/vector/pinecone-service";
import { uploadFileEmbeddingToPinecone } from "@/actions/upload-file-into-services";

export async function overwriteFileAcrossServices(file: File, userId: string) {
  const awsService = new AWSService(userId);
  const sanitizedFileName = sanitizeFileName(file.name);
  const fileKey = awsService.generateFileKey(file.name, userId);

  try {
    await awsService.deleteFile(sanitizedFileName);
    await awsService.uploadFileToS3(file);

    const deletionResult = await deleteFileFromDatabase(
      sanitizedFileName,
      userId,
    );
    const fileResponse = await uploadFileToDatabaseAndS3(file);

    if (!fileResponse.fileId) {
      throw new Error("Failed to upload file to the database");
    }

    await deleteEmbeddingFromPinecone(deletionResult.fileId, userId);
    await uploadFileEmbeddingToPinecone(
      file,
      userId,
      fileResponse.fileId!,
      fileKey,
    );

    return { success: true, fileId: fileResponse.fileId };
  } catch (error) {
    console.error("overwriteFileAcrossServices failed", error);
    return { success: false, error: (error as Error).message };
  }
}
