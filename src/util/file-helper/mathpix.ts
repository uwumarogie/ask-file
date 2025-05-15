import { structureFormatStringToArray } from "@/util/openai-service/format-service";

type MATHPIX_RESPONSE = {
  version: string;
  text: string;
  page_idx: number;
  pdf_selected_len: number;
};

export function parseResponse(response: string | null) {
  if (!response) {
    throw new Error("Response is null");
  }
  const match = response.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    const jsonString = match[1].trim();
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      throw new Error("Failed to parse JSON: " + e);
    }
  }
  throw new Error("JSON array not found in the response.");
}
//------------------- Technical Document ------------------- //

export async function streamPDF(pdf_id: string) {
  try {
    const response = await fetch(
      `https://api.mathpix.com/v3/pdf/${pdf_id}/stream`,
      {
        method: "GET",
        headers: {
          app_id: process.env.MATHPIX_APP_ID!,
          app_key: process.env.MATHPIX_APP_KEY!,
        },
      },
    );
    if (!response.ok || !response.body) {
      throw new Error(`Mathpix API error: ${response.statusText}`);
    }
    const reader = response.body.getReader();
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      text += new TextDecoder().decode(value);
    }
    const resObject = await structureFormatStringToArray(text);
    return parseResponse(resObject.response);
  } catch (error) {
    console.error("Error streaming PDF:", error);
    throw error;
  }
}

export async function extractLaTeXFromFile(
  fileKey: string,
): Promise<Array<MATHPIX_RESPONSE>> {
  const fileURL = process.env.AWS_BASE_URL + fileKey;
  const response = await fetch("https://api.mathpix.com/v3/pdf", {
    method: "POST",
    headers: {
      app_id: process.env.MATHPIX_APP_ID!,
      app_key: process.env.MATHPIX_APP_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: fileURL,
      streaming: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`Mathpix API error: ${response.statusText}`);
  }
  const data = await response.json();
  const result = await streamPDF(data.pdf_id);
  return result;
}
