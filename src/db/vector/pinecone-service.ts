"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateQueryEmbedding } from "../../util/openai-service/embedding-service";
import * as z from "zod";
import { getUser } from "../relational/functions/user";

const createEmbeddingSchema = z.union([
  z.object({
    success: z.literal(true),
    embedding: z.array(z.array(z.number())),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
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
  const index = pinecone.index("ask-file");
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
  } catch (error) {
    console.error(`Error upserting vectors to Pinecone ${error}`);
    throw error;
  }
}

export async function deleteEmbeddingFromPinecone(
  file_id: string,
  namespace: string,
) {
  if (file_id.length === 0 || namespace.length === 0) {
    throw new Error("file_id or namespace is empty");
  }
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file").namespace(namespace);

  const prefix = `chunk-${file_id}`;
  const pageOneList = await index.listPaginated({
    prefix: prefix,
  });

  const pageVectorList = pageOneList?.vectors?.map((item) => item.id);
  await index.namespace(namespace).deleteMany(pageVectorList!);
}

export async function searchPineconeResults(
  query: number[],
  namespace: string,
  file_id: string,
) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file").namespace(namespace);

  const roughResults = await index.query({
    vector: query,
    topK: 10,
    includeMetadata: true,
    filter: {
      file_id: file_id,
    },
  });

  return roughResults;
}

export async function queryPinecone(input: string, file_id: string) {
  const user = await getUser();
  const _context = await generateQueryEmbedding(input);
  const response = createEmbeddingSchema.parse(_context);

  if (!response.success) {
    console.error(response.error);
    throw new Error("Failed generating the embedding of the input");
  } else {
    const [vector] = response.embedding;
    return await searchPineconeResults(vector, user.id, file_id);
  }
}
