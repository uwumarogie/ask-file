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
      const batchEmbeddings = validateResponse.data.map(
        (item) => item.embedding,
      );
      embeddings.push(batchEmbeddings);
      console.debug("Batch embeddings:", batchEmbeddings);
    } catch (error) {
      console.error("Error generating embeddings:", error);
    }
  }

  return embeddings.flat();
}

export async function getCategorieContext(
  text: string | undefined,
): Promise<{ success: boolean; responseText: string | null }> {
  try {
    if (!text) {
      throw new Error("The pdf is most likely empty.");
    }

    const input = `I will provide you with a text consisting of approximately 3 pages from a PDF document.
	  Your task is to classify the text into one of the following categories:
	  1. Technical Document: Content related to computer science, engineering, or mathematics.
	  2. News Article: Journalistic content typically covering current events.
	  3. Educational Material: Content resembling university slides or lecture notes.
	  Input Text: ${text}
          Please identify the category that best fits the provided text.`;

    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 1.0,
    });

    return { success: true, responseText: response.choices[0].message.content };
  } catch (error) {
    console.error(error);
    return { success: false, responseText: "Something went wrong" };
  }
}
