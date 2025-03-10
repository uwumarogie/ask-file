export function formatStringToArray(text: string) {
  return `You are given a string that contains a structure of objects.
Please convert the string into a valid JSON array (with no markdown formatting or extra text).
Input: ${text}`;
}
