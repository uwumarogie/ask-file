import { AWSService } from "./aws-service";

export async function uploadFileToS3(userId: string, file: File) {
  const awsService = new AWSService(userId);
  try {
    const awsFileKey = await awsService.uploadFileToS3(file);
    return { success: true, fileKey: awsFileKey };
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return { success: false, message: (error as Error).message };
  }
}
