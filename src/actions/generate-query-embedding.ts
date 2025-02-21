"use server";
import { generateInputEmbedding } from "@/database/vector/util/openai-helper";
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

export async function generateQueryEmbedding(input: string) {
  try {
    const _context = await generateInputEmbedding(input);
    const response = embeddingSchema.parse(_context);
    const embedding = response.data.map((item) => item.embedding);
    if (embedding.length === 0) {
      return { success: false, response: "The embedding was empty." };
    }
    return { success: true, response: embedding };
  } catch (error) {
    console.error(error);
    return { success: false, response: error };
  }
}
