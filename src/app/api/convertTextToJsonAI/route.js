import { NextResponse } from "next/server";

import { convertTextToJsonAI } from "@/app/server/services/ai.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pdfText } = body;

    const response = await convertTextToJsonAI(pdfText);
    return NextResponse.json({ response });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
