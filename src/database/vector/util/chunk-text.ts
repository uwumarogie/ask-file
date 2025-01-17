import * as LangChain from "@langchain/textsplitters";

type Category =
  | "Technical Document"
  | "News Article"
  | "Educational Material"
  | "General"
  | "Error";

type SplitterConstructor =
  | (new (...args: any[]) => LangChain.TextSplitter)
  | (new (...args: any[]) => LangChain.LatexTextSplitter)
  | (new (...args: any[]) => LangChain.TokenTextSplitter)
  | (new (...args: any[]) => LangChain.RecursiveCharacterTextSplitter);

const splitterMap: Record<Category, SplitterConstructor> = {
  "Technical Document": LangChain.LatexTextSplitter,
  "News Article": LangChain.RecursiveCharacterTextSplitter,
  "Educational Material": LangChain.TokenTextSplitter,
  General: LangChain.RecursiveCharacterTextSplitter,
  Error: LangChain.RecursiveCharacterTextSplitter,
};

export function chunkText(category: Category, text: string | undefined) {
  const CHUNK_SIZE = 1000;
  const CHUNK_OVERLAP = 100;

  if (text === undefined || category === "Error") {
    throw new Error("No text to chunk");
  }

  const SplitterClass = splitterMap[category];

  return new SplitterClass({
    CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  }).splitText(text);
}
