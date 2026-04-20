import OpenAI, { toFile } from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
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

    const body = await req.json();
    const { pdfText } = body;

    const delimiter = "####";

    const prompt = [
      {
        // system message
        role: "developer",
        content: `
          You will be provided with a text which corresponds to a resume.
          The text is delimited with ${delimiter} characters.
          Your task is to extract structured resume data in JSON format.
          Return ONLY valid JSON matching this schema:
          {
            name: string,
            email: string,
            phone?: string,
            skills: string[],
            experience: [
              {
                company: string,
                role: string,
                startDate: string,
                endDate?: string,
                description: string
              }
            ],
            education: [
              {
                institution: string,
                degree: string,
                year: string
              }
            ]
          }
        `
      },
      {
        role: "user",
        content: `${delimiter} ${pdfText.text} ${delimiter}`,
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

    // Here is where we communicate with the OpenAI API to create our chatbot.
    // We store the chatbot's response in the 'response' variable
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      // instructions: "Talk like a pirate.",
      temperature: 0.7,
      // We add a value for max_tokens to ensure the response won't exceed 300 tokens
      // This is to make sure the responses aren't too long
      // max_tokens: 300,
      input: prompt,
    });
    // Then we return the response we receive from OpenAI
    // Note: This will only work once we set up our frontend logic
    return NextResponse.json({ response: response });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
