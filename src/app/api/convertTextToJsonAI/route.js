import { NextResponse } from "next/server";

import { convertTextToJsonOpenAI } from "@/app/server/services/openai.service";
import { ResumeSchema } from "@/app/server/validators/resume.schema";
import { cleanLLMOutput } from "@/utils/helper";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pdfText } = body;

    const rawOutput = await convertTextToJsonOpenAI(pdfText);

    // Step 1: Parse JSON safely
    let parsed;
    try {
      const cleanedOutput = cleanLLMOutput(rawOutput.output_text);
      parsed = JSON.parse(cleanedOutput);
    } catch (err) {
      return NextResponse.json({
        error: "Invalid JSON from LLM",
        rawOutput: rawOutput.output_text
      }, { status: 500 });
    }

    // Step 2: Zod validation
    const result = ResumeSchema.safeParse(parsed);

    if (!result.success) {
      return NextResponse.json({
        error: "Schema validation failed",
        issues: result.error.errors,
        raw: parsed
      }, { status: 422 });
    }

    return NextResponse.json({ response: result.data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
