"use server";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateQueryEmbedding } from "../../actions/generate-query-embedding";
const PINECONE_HOST = process.env.PINECONE_HOST;
import * as z from "zod";

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
  } catch (error) {
    console.error(`Error upserting vectors to Pinecone ${error}`);
    throw error;
  }
}

export async function deleteEmbeddingFromPinecone(
  file_id: string,
  namespace: string,
) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file", PINECONE_HOST);
  const pageOneList = await index.listPaginated({
    prefix: `chunk-${file_id}-`,
  });
  console.debug("pageOneList", pageOneList);
  const pageVectorList = pageOneList?.vectors?.map((item) => item.id);
  console.debug("pageVectorList", pageVectorList);
  await index.namespace(namespace).deleteMany(pageVectorList!);
}

export async function searchPinecone(
  query: number[],
  namespace: string,
  file_id: string,
) {
  const pinecone = await initializePinecone();
  const index = pinecone.index("ask-file", PINECONE_HOST);

  const roughResults = await index.namespace(namespace).query({
    vector: query,
    topK: 10,
    includeMetadata: true,
  });
  const result = roughResults.matches.filter(
    (result) => result?.metadata?.file_id === file_id,
  );
  return result;
}

export async function queryPinecone(
  input: string,
  namespace: string,
  file_id: string,
) {
  const _context = await generateQueryEmbedding(input);
  const response = createEmbeddingSchema.parse(_context);

  if (!response.success) {
    console.error(response.error);
    throw new Error("Failed generating the embedding of the input");
  } else {
    const [vector] = response.embedding;
    await searchPinecone(vector, namespace, file_id);
  }
}
