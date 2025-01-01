// TODO: Remove the logging before pushing to production
import * as z from "zod";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const openAIEmbeddingSchema = z.object({
  object: z.string(),
  data: z.object({
    object: z.string(),
    index: z.number(),
    embedding: z.array(z.number()),
  }),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export async function generateEmbedding(
  chunkedText: string[],
): Promise<number[][]> {
  const batchSize = 1000;
  const embeddings = [];
  for (let i = 0; i < chunkedText.length; i += batchSize) {
    const batch = chunkedText.slice(i, i + batchSize);

    try {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: batch,
        encoding_format: "float",
      });
      const validateResponse = openAIEmbeddingSchema.parse(embedding);
      const batchEmbeddings = validateResponse.data.embedding;
      embeddings.push(batchEmbeddings);
      console.debug("Batch embeddings:", batchEmbeddings);
    } catch (error) {
      console.error("Error generating embeddings:", error);
    }
  }

  return embeddings;
}
