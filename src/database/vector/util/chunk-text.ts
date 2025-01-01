/*
 * Function to chunk text into smaller chunks
 * TODO. Use better chunking algoritm
 * Think of the use case where the text contains like Mr. and so on
 * */

export function chunkText(
  text: string | undefined,
  chunkSize: number = 1000,
  overlap: number = 100,
) {
  if (text === undefined) {
    throw new Error("No text to chunk");
  }
  return text.split(".");
}
