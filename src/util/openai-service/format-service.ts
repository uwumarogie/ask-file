import getTextSummaryForImage from "../prompts/get-summary";
import openai from "./openai-client";
import { formatStringToArray } from "@/util/prompts/format-string-to-array";

export async function structureFormatStringToArray(
  text: string,
): Promise<{ success: boolean; response: string | null }> {
  try {
    const prompt = formatStringToArray(text);
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

    return { success: true, response: response.choices[0].message.content };
  } catch (error) {
    console.error("Error in structureFormatStringToArray function:", error);
    return {
      success: false,
      response:
        "Something went wrong in the structureFormatStringToArray function",
    };
  }
}

export async function getSummaryFromText(text: string) {
  try {
    const prompt = getTextSummaryForImage(text);
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
    return { success: true, text: response.choices[0].message.content };
  } catch (error) {
    console.error("Error in getSummaryFromText:", error);
    return {
      success: false,
      text: "Something went wrong in the getSummaryFromText function",
    };
  }
}
