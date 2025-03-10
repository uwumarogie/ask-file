import openai from "./openai-client";
import { getCategoryPrompt } from "@/util/prompts/find-category";

export async function getCategorieContext(
  text?: string,
): Promise<{ success: boolean; responseText: string | null }> {
  if (!text) {
    console.error("The PDF is most likely empty.");
    return { success: false, responseText: "The PDF is most likely empty." };
  }

  try {
    const prompt = getCategoryPrompt(text);
    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1.0,
    });

    return { success: true, responseText: response.choices[0].message.content };
  } catch (error) {
    console.error("Error in getCategorieContext:", error);
    return { success: false, responseText: "Something went wrong" };
  }
}
