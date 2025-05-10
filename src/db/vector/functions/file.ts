import { generateEmbedding } from "@/util/openai-service/embedding-service";
import { upsertEmbedding } from "@/db/vector/pinecone-service";

export async function uploadFileEmbeddingToPinecone(
  file: File,
  userId: string,
  fileId: string,
  fileKey: string,
) {
  try {
    // Dynamically import chunking util so static imports (e.g. PDF.js) are not evaluated on initial load
    const { getChunkedTextFromFile } = await import(
      "@/db/vector/util/chunk-text"
    );
    const chunks = await getChunkedTextFromFile(file, fileKey);
    const embeddings = await generateEmbedding(chunks);
    const response = await upsertEmbedding(chunks, embeddings, fileId, userId);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
