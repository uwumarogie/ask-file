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
    getChunkedTextFromFile(file);
    // await uploadFileEmbeddingToPinecone(file, user.id, sanitizedFileName);
    return { success: true, response: fileId };
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

function buildPrompt(text: string) {
  return `I will provide you with a text consisting of approximately 3 pages from a PDF document.
	  Your task is to classify the text into one of the following categories:
	  1. Technical Document: Content related to computer science, engineering, or mathematics.
	  2. News Article: Journalistic content typically covering current events.
	  3. Educational Material: Content resembling university slides or lecture notes.
	  Input Text: ${text}
          Please identify the category that best fits the provided text.`;
}

function getCategory(response: {
  success: boolean;
  responseText: string | null;
}) {
  if (!response.success || response.responseText === null) {
    return "Error";
  }

  if (response.responseText.includes("Technical Document")) {
    return "Technical Document";
  } else if (response.responseText.includes("News Article")) {
    return "News Article";
  } else if (response.responseText.includes("Educational Material")) {
    return "Educational Material";
  } else {
    return "General";
  }
}

/*
 * TODO: Change the method of retrieving the text from the category for better accuracy
 * maybe use for technical documents, the api called mathpix
 *  this is a bad  function refactor it and use smaller functions
 */

async function getChunkedTextFromFile(file: File | null) {
  if (!file) {
    throw new Error("No file selected");
  }
  const buffer = await file.arrayBuffer();
  const PDFParser = new PDFParse();
  const data = await PDFParser.loadPDF(buffer);
  const contextText = data?.text.slice(0, 1100);
  const response = await getCategorieContext(contextText);
  const category = getCategory(response);
  const text = data?.text;
  return chunkText(category, text);
}
