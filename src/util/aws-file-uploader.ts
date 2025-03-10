import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export class AWSUploader {
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

  private generateFileKey(originalFileName: string, userId: string) {
    return `users/${userId}/files/${originalFileName}`;
  }

  async uploadFile(file: File | null) {
    if (!file) {
      throw new Error("No file selected");
    }
    const fileKey = this.generateFileKey(file.name, this.userId);
    console.debug("Uploading file to S3:", fileKey);

    const buffer = await file.arrayBuffer();
    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      }),
    );

    console.debug("File uploaded to S3:", fileKey);
    return fileKey;
  }
  async uploadMany(files: File[]) {
    try {
      const paths = await Promise.all(
        files.map(async (file) => this.uploadFile(file)),
      );

      return paths;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
