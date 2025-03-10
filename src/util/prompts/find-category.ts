export function getCategoryPrompt(text: string) {
  return `Project Title:
Advanced Text Categorization for Multi-Domain Documents

Objective:
Develop a robust system to classify a text document (approximately three pages extracted from a PDF) into one of the following categories:
1. Technical Document: Content pertaining to computer science, engineering, or mathematics.
2. News Article: Journalistic content focusing on current events.

Task Description:
Given an input text (denoted as \`${text}\`), analyze and determine the category that best describes its content. Your classification should consider the following aspects:

- Linguistic Style and Terminology:
  - Identify whether the language is technical and domain-specific, indicative of scientific or engineering discussions.
  - Determine if the narrative is journalistic, with a focus on reporting current events.
  - Assess if the tone is educational, with structured explanations or didactic elements typical of academic materials.

- Structural and Formatting Cues:
  - Evaluate the layout for elements such as bullet points, headings, or section breaks that are common in educational or technical documents.
  - Look for journalistic elements such as quotes, leads, or an inverted pyramid structure in news articles.

- Purpose and Context:
  - Analyze the overall intent of the document—whether it is meant to inform through data and technical exposition, report on current events, or instruct and educate.
  - Recognize overlapping elements and determine which domain is most dominantly represented.

Instructions:

1. Preprocessing:
   - Clean and normalize the input text to remove extraneous formatting or artifacts from the PDF extraction process.

2. Feature Extraction:
   - Extract key features such as domain-specific keywords, sentence structure, and stylistic markers that can distinguish one category from another.

3. Classification Methodology:
   - Develop or apply a rule-based or machine learning approach to assign the text to one of the three categories based on the extracted features.
   - Ensure that the chosen method can handle cases where the text might exhibit characteristics of multiple categories.

4. Justification:
   - Alongside the classification, provide a concise rationale that explains which features influenced the decision.
   - If the text presents hybrid features, justify the choice of the dominant category and explain the reasoning behind it.

5. Edge Case Handling:
   - In scenarios where the text overlaps multiple domains, define clear guidelines on how to weigh the influence of each feature to reach a final categorization.

Expected Outcome:
A clear classification of the input text into one of the three specified categories, supported by an analytical explanation that details the key factors influencing the decision.

Example:
- Input Text: \`${text}\`
- Output:
  - Category: Technical Document
  - Rationale: The text employs technical jargon, includes detailed diagrams and formulas, and follows a structure typical of research papers, which strongly indicates that it is a technical document.
`;
}
