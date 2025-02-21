"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateQueryEmbedding } from "../../actions/generate-query-embedding";
const PINECONE_HOST = process.env.PINECONE_HOST;
import * as z from "zod";

const createEmbeddingSchema = z.union([
  z.object({
    success: z.boolean(),
    response: z.array(z.array(z.number())),
  }),
  z.object({
    success: z.boolean(),
    response: z.string(),
  }),
]);

export async function initializePinecone() {
  const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is undefined!");
  }
  return new Pinecone({
    apiKey: PINECONE_API_KEY,
  });
}

export async function upsertEmbedding(
  chunks: string[],
  embeddings: number[][],
  file_id: string,
  namespace: string,
) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file", PINECONE_HOST);
  const vectors = chunks.map((chunk, i) => ({
    id: `chunk-${file_id}-${i}`,
    values: embeddings[i],
    metadata: {
      file_id: file_id,
      text: chunk,
    },
  }));

  try {
    await index.namespace(namespace).upsert(vectors);
    console.log("Upserted vectors to Pinecone");
  } catch (error) {
    console.error(`Error upserting vectors to Pinecone ${error}`);
    throw error;
  }
}

export async function searchPinecone(query: number[], namespace: string) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file", PINECONE_HOST);

  //FIX:;find a way to filter it better
  // smaller chunking size or filter from the id using the file_id

  const matches = await index.namespace(namespace).query({
    vector: query,
    topK: 10,
    includeMetadata: true,
  });

  console.debug(matches.matches);
}

export async function queryPinecone(input: string, namespace: string) {
  const _context = await generateQueryEmbedding(input);
  const response = createEmbeddingSchema.parse(_context);

  if (!response.success && response.response instanceof String) {
    console.error(response.response);
    throw new Error("Failed generating the embedding of the input");
  }

  if (Array.isArray(response.response)) {
    const [vector] = response.response;
    await searchPinecone(vector, namespace);
  }
}
