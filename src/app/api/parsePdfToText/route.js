import { NextResponse } from "next/server";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";

// v2 runs pdf.js in a worker; Next’s bundle breaks the default worker path — point at the package on disk.
PDFParse.setWorker(
  pathToFileURL(
    join(process.cwd(), "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs")
  ).href
);

export async function POST(req) {
  let parser;
  try {
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

    const data = new Uint8Array(await file.arrayBuffer());
    parser = new PDFParse({ data });
    const result = await parser.getText();

    return NextResponse.json({ response: result });
  } catch (err) {
    console.error("parsePdfToText:", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch {
        /* ignore */
      }
    }
  }
}
