export function sanitizeFileName(fileName: string) {
  return fileName.split(".").slice(0, -1).join("");
}

export function getFiletype(file_path: string) {
  if (file_path.includes(".pdf")) {
    return "PDF";
  }
}
