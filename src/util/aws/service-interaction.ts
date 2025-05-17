import { getUser } from "@/db/relational/functions/user";
import { AWSService } from "./aws-service";

export async function uploadFileToS3(file: File) {
  const user = await getUser();
  const awsService = new AWSService(user.id);
  try {
    const awsFileKey = await awsService.uploadFileToS3(file);
    return { success: true, fileKey: awsFileKey };
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return { success: false, message: (error as Error).message };
  }
}
