import OpenAI from "openai";
import { ResumeSchema } from "@/app/server/validators/resume.schema";

export async function convertTextToJsonOpenAI(pdfText) {
  try {
    const OPEN_AI_KEY = process.env.OPEN_AI_KEY;
    if (!OPEN_AI_KEY) {
      return NextResponse.json(
        {
          error:
            "Missing OPEN_AI_KEY. Set OPEN_AI_KEY in .env.local at the project root, then restart `next dev`.",
        },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: OPEN_AI_KEY });

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
      // {
      //   role: "user",
      //   content: [
      //       {
      //           type: "input_text",
      //           text: "Analyze the document and extract the text from it.",
      //       },
      //       {
      //           type: "input_file",
      //           text: text,
      //       },
      //   ],
      // },
    ];

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      input: prompt,
    });
    return response;
  } catch (err) {
    return err.message;
  }
}
