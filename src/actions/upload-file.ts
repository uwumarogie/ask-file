"use server";

import PDFParse from "pdf-parse2";
import { db } from "@/database/relational/connection";
import { files } from "@/database/relational/schema";
import { AWSUploader } from "@/util/aws-file-uploader";
import { eq } from "drizzle-orm";
import {
  generateEmbedding,
  getCategorieContext,
} from "@/database/vector/util/openai-helper";
import {
  initializePinecone,
  getIndex,
  upsertEmbedding,
} from "@/database/vector/index";
import { currentUser } from "@clerk/nextjs/server";
import { sanitizeFileName } from "@/util/file-modification/util";
import { v4 as uuidv4 } from "uuid";
import { chunkText } from "@/database/vector/util/chunk-text";

type Category =
  | "Technical Document"
  | "News Article"
  | "Educational Material"
  | "General"
  | "Error";

const Categories = {
  Technical: "Technical Document",
  News: "News Article",
  Educational: "Educational Material",
  General: "General",
  Error: "Error",
} as const;

const pinecone = await initializePinecone();

export async function insertFileData(file: File) {
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
    const fileId = uuidv4();
    await db.insert(files).values({
      file_id: fileId,
      user_id: user.id,
      file_name: sanitizedFileName,
      file_path: fileKey,
    });
    await uploadFileEmbeddingToPinecone(file, sanitizedFileName);
    return { success: true, response: fileId };
  } catch (error) {
    console.error(error);
    return { success: false, response: error };
  }
}

async function uploadFileEmbeddingToPinecone(
  file: File | null,
  fileName: string,
) {
  try {
    const chunks = await getChunkedTextFromFile(file);
    console.debug("HELOWiröbewrbwörbweiewb");
    console.log("fileName", fileName);
    const index = await getIndex(pinecone, fileName);
    console.debug(index);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(index, chunks, embeddings, fileName);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getCategory(response: {
  success: boolean;
  responseText: string | null;
}): Category {
  if (!response.success || response.responseText === null) {
    return Categories.Error;
  }
  const { responseText } = response;

  if (responseText.includes(Categories.Technical)) {
    return Categories.Technical;
  }
  if (responseText.includes(Categories.News)) {
    return Categories.News;
  }
  if (responseText.includes(Categories.Educational)) {
    return Categories.Educational;
  }
  return Categories.General;
}

async function initialText(file: File | null) {
  if (!file) {
    throw new Error("No file selected");
  }
  const buffer = await file.arrayBuffer();
  const PDFParser = new PDFParse();
  const data = await PDFParser.loadPDF(buffer);
  if (!data?.text) {
    throw new Error("No text in the pdf");
  }
  return data.text;
}

async function getChunkedTextFromFile(file: File | null) {
  const contextText = await initialText(file);
  const textCategory = await getCategorieContext(contextText.slice(0, 1100));
  const category = getCategory(textCategory);
  /* TODO: After getting the category, we need to get the best form for the text LATEX, text for the image without giving it to openai. */
  const rawText = contextText;
  const chunkedText = await chunkText(category, rawText);
  return chunkedText;
}
