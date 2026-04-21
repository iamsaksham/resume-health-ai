
export function cleanLLMOutput(rawText) {
  if (!rawText) return "";

  return rawText
    .replace(/```json/g, "")   // remove ```json
    .replace(/```/g, "")       // remove ```
    .replace(/\n/g, " ")       // remove newlines (optional)
    .trim();
}
