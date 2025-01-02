"use server";

import PDFParse from "pdf-parse2";
import { db } from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { AWSUploader } from "@/util/aws-file-uploader";
import { eq } from "drizzle-orm";
import { chunkText } from "@/database/vector/util/chunk-text";
import {
  initializePinecone,
  getIndex,
  upsertEmbedding,
} from "@/database/vector/index";
import { generateEmbedding } from "@/database/vector/util/generate-embedding";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { NextResponse } from "next/server";

const pinecone = await initializePinecone();

//NOTE: this function name is too long CHANGE THIS
export async function insertUserAndFileData(file: File) {
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
    await db.insert(files).values({
      file_id: `${user.id}, ${sanitizedFileName}`,
      user_id: user.id,
      file_name: sanitizedFileName,
      file_path: fileKey,
    });

    const response = await uploadFileEmbeddingToPinecone(
      file,
      user.id,
      sanitizedFileName,
    );

    return { success: true, response: sanitizedFileName };
  } catch (error) {
    console.error(error);
    return { success: false, response: error };
  }
}

async function uploadFileEmbeddingToPinecone(
  file: File | null,
  userId: string,
  fileName: string,
) {
  try {
    const chunks = await getChunkedTextFromFile(file);
    const index = await getIndex(pinecone, userId);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(index, chunks, embeddings, fileName);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getChunkedTextFromFile(file: File | null) {
  if (!file) {
    throw new Error("No file selected");
  }
  const buffer = await file.arrayBuffer();
  const PDFParser = new PDFParse();
  const data = await PDFParser.loadPDF(buffer);
  const text = data?.text;
  console.log("PDF data:", data?.text);
  return chunkText(text);
}
