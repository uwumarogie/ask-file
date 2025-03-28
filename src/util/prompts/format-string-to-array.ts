export function formatStringToArray(text: string) {
  return `
You are given a string that contains a structure of objects.
Please convert the string into a valid JSON array.
Your output must be exactly in the following format (do not include any extra text or formatting):

\`\`\`json
[
  /* Your JSON array here */
]
\`\`\`

Input: ${text}
`;
}
