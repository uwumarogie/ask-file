export function sanitizeFileName(fileName: string) {
  return fileName.split(".").slice(0, -1).join("");
}
