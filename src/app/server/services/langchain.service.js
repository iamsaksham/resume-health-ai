import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";

import { ResumeSchema } from "@/app/server/validators/resume.schema";

export async function convertTextToJsonLangChainAI(pdfText) {
  try {
    const delimiter = "####";
    const prompt = [
      {
        // system message
        role: "developer",
        content: `
          You will be provided with a text which corresponds to a resume.
          The text is delimited with ${delimiter} characters.
          Your task is to extract structured resume data in JSON format.
          Return ONLY valid JSON that matches the schema below:

          Schema: ${JSON.stringify(ResumeSchema.shape, null, 2)}

          Do NOT include the following in your response:
          - backticks
          - markdown
          - explanation text

          Output must start with { and end with }
        `
      },
      {
        role: "user",
        content: `Resume text: ${delimiter} ${pdfText.text} ${delimiter}`,
      },
    ];

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    const agent = createAgent({
      model,
      responseFormat: ResumeSchema,
    });

    const response = await agent.invoke({
      messages: prompt,
    });

    return response;
  } catch (err) {
    return err.message;
  }
}
