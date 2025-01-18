"use server";
import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_HOST = process.env.PINECONE_HOST;
export async function initializePinecone() {
  const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is undefined!");
  }
  return new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
}
// NOTE: namespace very important to differentiate between different files
export async function upsertEmbedding(
  chunks: string[],
  embeddings: number[][],
  file_id: string,
  namespace: string,
) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file", PINECONE_HOST);
  const vectors = chunks.map((chunk, i) => ({
    id: `chunk-${i}`,
    values: embeddings[i],
    metadata: {
      file_id: file_id,
      text: chunk,
    },
  }));

  try {
    await index.namespace(namespace).upsert(vectors);
  } catch (error) {
    console.error(`Error upserting vectors to Pinecone ${error}`);
    throw error;
  }
}
