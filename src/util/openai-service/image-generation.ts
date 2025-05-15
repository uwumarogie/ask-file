import openai from "./openai-client";

export async function generateImage(prompt: string) {
  try {
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
    });
    return { success: true, imageUrl: result.data[0].url };
  } catch (error) {
    console.error("Error in generateImage function:", error);
    return {
      success: false,
      response: "Something went wrong in the generateImage function",
    };
  }
}
