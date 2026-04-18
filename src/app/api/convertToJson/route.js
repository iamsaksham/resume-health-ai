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

    const body = await req.formData();
    const file = body.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          error:
            "Missing file. POST multipart/form-data with a non-empty `file` field (PDF, DOC, or DOCX).",
        },
        { status: 400 }
      );
    }

    const fileData = await toFile(file);

    const fileObj = await client.files.create({
      file: fileData,
      purpose: "user_data",
    });
    // const delimiter = "####";

    const prompt = [
      {
        // system message
        role: "developer",
        content: `
          You will be provided with a pdf or docx or doc file.
          Your task is to extract the text from the file.
          Return the text in the following format: <text>...</text>
          The text should be in the same language as the file.
        `
      },
      // {
      //   role: "user",
      //   content: `${delimiter} ${file} ${delimiter}`,
      // },
      {
        role: "user",
        content: [
            {
                type: "input_text",
                text: "Analyze the document and extract the text from it.",
            },
            {
                type: "input_file",
                file_id: fileObj.id,
            },
        ],
    },
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
