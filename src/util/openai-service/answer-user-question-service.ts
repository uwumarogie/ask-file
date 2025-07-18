import type {
  QueryResponse,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import openai from "./openai-client";

export async function answerUserQuestion(
  input: string,
  pineconeResult: QueryResponse<RecordMetadata>,
) {
  try {
    const prompt = answerUserQuestionPrompt(input, pineconeResult);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return { success: true, responseText: response.choices[0].message.content };
  } catch (error: unknown) {
    console.error("Error answering user question", error);
    return { success: false, error: (error as Error).message };
  }
}

function answerUserQuestionPrompt(
  input: string,
  pineconeResult: QueryResponse<RecordMetadata>,
) {
  const context = pineconeResult.matches
    .map((match) => match?.metadata?.text)
    .join("\n\n");

  return `
You are an expert academic AI assistant specialized in technical documentation retrieval and synthesis. 
Use the extracted contexts below to answer the user’s question with precision, citing each source by its file_id.

=== CONTEXTS ===
${context}

=== QUESTION ===
${input.trim()}

=== INSTRUCTIONS ===
1. Answer in a clear, concise academic style.
2. Support every factual statement with an inline citation to its source, e.g. “[file_id: XYZ]”.
3. Do not introduce information not contained in the contexts.
5. Keep the answer self-contained; do not restate the full context.

=== ANSWER ===
`;
}
