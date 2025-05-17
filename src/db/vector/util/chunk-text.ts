//NOTE: Refactor the entire file after finishing the splitting feature

import * as LangChain from "@langchain/textsplitters";
import { type Category } from "@/db/relational/functions/files";
import { getCategorieContext } from "@/util/openai-service/category-service";
import { extractLaTeXFromFile } from "@/util/file-helper/mathpix";
import { classifyCategoryFromContext } from "@/util/file-helper/util";

async function extractTextFromPdf(
  file: File,
  readEntireDocument: boolean,
): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@5.2.133/build/pdf.worker.min.mjs";

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const ONE_PAGE = 1;
  const numPages = readEntireDocument ? pdf.numPages : ONE_PAGE;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page: any = await pdf.getPage(pageNumber);
    const { items } = await page.getTextContent();
    const pageStr = items.map((item: any) => item.str).join(" ");
    pageTexts.push(pageStr);
  }

  return pageTexts.join("\n\n");
}

export async function getInitialTextFromFile(
  file: File | null,
  readEntireDocument: boolean,
) {
  if (!file) {
    throw new Error("No file selected");
  }
  const text = await extractTextFromPdf(file, readEntireDocument);
  return text;
}

export async function getChunkedTextFromFile(
  file: File | null,
  fileKey: string,
) {
  if (typeof window === "undefined") {
    const latex = await extractLaTeXFromFile(fileKey);
    return latex.map((item) => item.text);
  }
  const contextText = await getInitialTextFromFile(file, false);
  const textCategory = await getCategorieContext(contextText);
  const category = classifyCategoryFromContext(textCategory.responseText);
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
