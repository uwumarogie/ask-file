"use server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { AWSService } from "@/util/aws/aws-service";
import { deleteFileFromDatabase } from "@/actions/delete-file-from-postgres";
import { uploadFileToDatabase } from "@/actions/upload-file-into-services";
import { deleteEmbeddingFromPinecone } from "@/database/vector/pinecone-service";
import { uploadFileEmbeddingToPinecone } from "@/actions/upload-file-into-services";

/**
 * Overwrites an existing file in all connected services (POSTGRES, S3, PINECONE)
 **/

export async function overwriteFileAcrossServices(file: File, userId: string) {
  try {
    const awsService = new AWSService(userId);
    const sanitizedFileName = sanitizeFileName(file.name);

    await awsService.deleteFile(sanitizedFileName);
    await deleteEmbeddingFromPinecone(sanitizedFileName, userId);
    const deletionResult = await deleteFileFromDatabase(
      sanitizedFileName,
      userId,
    );

    await uploadFileToDatabase(file);
    await awsService.uploadFileToS3(file);
    const fileKey = new AWSService(userId).generateFileKey(file.name, userId);
    await uploadFileEmbeddingToPinecone(
      file,
      userId,
      deletionResult.fileId,
      fileKey,
    );
  } catch (error) {
    console.error("overwriteFileAcrossServices failed", error);
    throw error;
  }
}
