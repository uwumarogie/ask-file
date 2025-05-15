import { type Category } from "@/db/relational/functions/files";

export function sanitizeFileName(fileName: string) {
  return fileName.split(".").slice(0, -1).join("");
}

export function getFiletype(file_path: string) {
  if (file_path.includes(".pdf")) {
    return "PDF";
  }
}

export function classifyCategoryFromContext(text: string | null): Category {
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
