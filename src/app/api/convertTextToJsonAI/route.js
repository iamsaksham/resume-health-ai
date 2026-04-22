import { NextResponse } from "next/server";

import { convertTextToJsonLangChainAI } from "@/app/server/services/langchain.service";
import { ResumeSchema } from "@/app/server/validators/resume.schema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pdfText } = body;

    const rawOutput = await convertTextToJsonLangChainAI(pdfText); // for langchain

    // Zod validation
    const result = ResumeSchema.safeParse(rawOutput.structuredResponse); // for langchain

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
