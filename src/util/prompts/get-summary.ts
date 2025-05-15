export default function getTextSummaryForImage(text: string) {
  return `
You will receive a text either about technical document or news article.
Text: ${text}
Your job is to summarize the text into 4 sentences.
Map the text to a famous person for the image.
These sentences should be a nice description for an image to the topic.
Example:
If the text is about the relativity theory fromm Albert Einstein, then the description / summary should contain the image of Albert Einstein.
`;
}
