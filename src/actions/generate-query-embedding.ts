"use server";
import { generateInputEmbedding } from "@/util/openai-service/embedding-service";
import * as z from "zod";

const embeddingSchema = z.object({
  object: z.string(),
  data: z.array(
    z.object({
      object: z.string(),
      index: z.number(),
      embedding: z.array(z.number()),
    }),
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

type GenerateEmbeddingResult =
  | { success: true; embedding: number[][] }
  | { success: false; error: string };

export async function generateQueryEmbedding(
  input: string,
): Promise<GenerateEmbeddingResult> {
  try {
    const embeddingResponse = await generateInputEmbedding(input);
    const response = embeddingSchema.parse(embeddingResponse);
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
