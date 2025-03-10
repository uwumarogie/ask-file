import * as LangChain from "@langchain/textsplitters";
import { type Category } from "@/actions/upload-file";
import PDFParse from "pdf-parse2";
import { getCategorieContext } from "@/util/openai-service/category-service";

type SplitterConstructor =
  | (new (...args: any[]) => LangChain.TextSplitter)
  | (new (...args: any[]) => LangChain.LatexTextSplitter)
  | (new (...args: any[]) => LangChain.TokenTextSplitter)
  | (new (...args: any[]) => LangChain.RecursiveCharacterTextSplitter);

const splitterMap: Record<Category, SplitterConstructor> = {
  "Technical Document": LangChain.LatexTextSplitter,
  "News Article": LangChain.RecursiveCharacterTextSplitter,
};

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
    return text;
  } catch (error) {
    console.error("Error streaming PDF:", error);
    throw error;
  }
}

async function extractLaTeXFromFile(fileKey: string): Promise<string> {
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
  console.debug("LaTeX extracted from file:", data.pdf_id);
  const result = await streamPDF(data.pdf_id);
  console.log(result);
  return data.latex;
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

async function getInitialTextFromFile(file: File | null) {
  if (!file) {
    throw new Error("No file selected");
  }
  const buffer = await file.arrayBuffer();
  const PDFParser = new PDFParse();
  const data = await PDFParser.loadPDF(buffer, { maxPages: 1 });
  if (!data?.text) {
    throw new Error("No text in the pdf");
  }
  return data.text;
}

export async function getChunkedTextFromFile(
  file: File | null,
  fileKey: string,
) {
  const contextText = await getInitialTextFromFile(file);
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
    return [""];
  }
  return [""];
}
