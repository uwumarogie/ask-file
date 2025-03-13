import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class AWSService {
  private client: S3Client;
  private userId: string;
  constructor(userId: string) {
    this.client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.userId = userId;
  }

  public generateFileKey(originalFileName: string, userId: string) {
    return `users/${userId}/files/${originalFileName}`;
  }

  async uploadFileToS3(file: File | null) {
    if (!file) {
      throw new Error("No file selected");
    }
    const fileKey = this.generateFileKey(file.name, this.userId);
    const buffer = await file.arrayBuffer();
    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      }),
    );

    return fileKey;
  }

  async deleteFile(fileName: string) {
    const fileKey = this.generateFileKey(fileName, this.userId);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
      }),
    );
  }

  async uploadMany(files: File[]) {
    try {
      const paths = await Promise.all(
        files.map(async (file) => this.uploadFileToS3(file)),
      );

      return paths;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
