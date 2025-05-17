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

type GenerateEmbeddingResult =
  | { success: true; embedding: number[][] }
  | { success: false; error: string };

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

//NOTE: This function is not used in the project. Later use the function
export async function generateQueryEmbedding(
  input: string,
): Promise<GenerateEmbeddingResult> {
  try {
    const embeddingResponse = await generateInputEmbedding(input);
    const response = openAIEmbeddingSchema.parse(embeddingResponse);
    const embedding = response.data.map((item) => item.embedding);

    if (embedding.length === 0) {
      return { success: false, error: "The embedding array was empty." };
    }

    return { success: true, embedding: embedding };
  } catch (error) {
    console.error("Error generating query embedding", error);
    return { success: false, error: (error as Error).message };
  }
}
