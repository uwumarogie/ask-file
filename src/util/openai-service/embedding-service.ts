import * as z from "zod";
import openai from "./openai-client";

const openAIEmbeddingSchema = z.object({
  object: z.string(),
  data: z.array(
    z.object({
      object: z.string(),
      index: z.number(),
      embedding: z.array(z.number()),
    }),
  ),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export async function generateInputEmbedding(input: string | string[]) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input,
    encoding_format: "float",
  });
  return embedding;
}

export async function generateEmbedding(
  chunkedText: string[],
): Promise<number[][]> {
  const batchSize = 1000;
  const embeddings: number[][] = [];

  for (let i = 0; i < chunkedText.length; i += batchSize) {
    const batch = chunkedText.slice(i, i + batchSize);
    try {
      const embedding = await generateInputEmbedding(batch);
      const validatedResponse = openAIEmbeddingSchema.parse(embedding);
      const batchEmbeddings = validatedResponse.data.map(
        (item) => item.embedding,
      );
      embeddings.push(...batchEmbeddings);
    } catch (error) {
      console.error("Error generating embeddings:", error);
    }
  }

  return embeddings;
}
