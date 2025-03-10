import * as LangChain from "@langchain/textsplitters";
import { type Category } from "@/actions/upload-file";
import PDFParse from "pdf-parse2";
import { getCategorieContext } from "@/database/vector/util/openai-helper";

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
    }),
  });
  if (!response.ok) {
    throw new Error(`Mathpix API error: ${response.statusText}`);
  }
  const data = await response.json();
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

  console.debug("Hello fro chunkText");
  if (category === "Technical Document") {
    const latex = await extractLaTeXFromFile(fileKey);
    console.debug(latex);
    return [""];
  }
  return [""];
}
