//NOTE: Refactor the entire file after finishing the splitting feature

import * as LangChain from "@langchain/textsplitters";
import { type Category } from "@/actions/upload-file";
import PDFParse from "pdf-parse2";
import { getCategorieContext } from "@/util/openai-service/category-service";
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

async function streamPDF(pdf_id: string) {
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
    console.debug("resObject", resObject);
    return parseResponse(resObject.response);
  } catch (error) {
    console.error("Error streaming PDF:", error);
    throw error;
  }
}

async function extractLaTeXFromFile(
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

//------------------- News Article ------------------- //

function findCategory(text: string | null): Category {
  if (text === null) {
    throw new Error("No text to classify");
  }
  const technicalIndex = text.indexOf("Technical Document");
  const newsIndex = text.indexOf("News Article");
  if (technicalIndex === -1 && newsIndex === -1) {
    throw new Error("No category found");
  }
  if (technicalIndex !== -1 && newsIndex !== -1) {
    return technicalIndex < newsIndex ? "Technical Document" : "News Article";
  }
  return technicalIndex !== -1 ? "Technical Document" : "News Article";
}

async function getInitialTextFromFile(file: File | null, allPages: boolean) {
  if (!file) {
    throw new Error("No file selected");
  }
  const buffer = await file.arrayBuffer();
  const PDFParser = new PDFParse();

  const data = allPages
    ? await PDFParser.loadPDF(buffer)
    : await PDFParser.loadPDF(buffer, { maxPages: 1 });
  if (!data?.text) {
    throw new Error("No text in the pdf");
  }
  return data.text;
}

export async function getChunkedTextFromFile(
  file: File | null,
  fileKey: string,
) {
  const contextText = await getInitialTextFromFile(file, false);
  const textCategory = await getCategorieContext(contextText);
  const category = findCategory(textCategory.responseText);
  return chunkText(category, file, fileKey);
}

export async function chunkText(
  category: Category,
  file: File | null,
  fileKey: string,
): Promise<Array<string>> {
  if (file === null) {
    throw new Error("There was no file delivered to chunk");
  }

  if (category === "Technical Document") {
    const latex = await extractLaTeXFromFile(fileKey);
    return latex.map((item) => item.text);
  } else if (category === "News Article") {
    const text = await getInitialTextFromFile(file, true);

    return new LangChain.RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    }).splitText(text);
  }
  return [""];
}
