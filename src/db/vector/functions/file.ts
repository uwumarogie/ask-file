import { generateEmbedding } from "@/util/openai-service/embedding-service";
import { upsertEmbedding } from "@/db/vector/pinecone-service";
import { getChunkedTextFromFile } from "@/db/vector/util/chunk-text";

export async function uploadFileEmbeddingToPinecone(
  file: File,
  userId: string,
  fileId: string,
  fileKey: string,
) {
  try {
    const chunks = await getChunkedTextFromFile(file, fileKey);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(chunks, embeddings, fileId, userId);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
