export const runtime = "nodejs";

import { ingest } from "@/lib/rag/ingest";
import { extractText as extractPdfText, getDocumentProxy } from "unpdf";
import officeParser from "officeparser";

const SUPPORTED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
};

async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  const type = SUPPORTED_TYPES[mimeType];

  if (!type) throw new Error(`Unsupported file type: ${mimeType}`);

  if (type === "txt") return buffer.toString("utf-8");

  if (type === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractPdfText(pdf, { mergePages: true });
    return text;
  }

  const ast = await officeParser.parseOffice(buffer);
  return ast.toText();
}

export async function POST(req: Request) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!SUPPORTED_TYPES[file.type]) {
    return Response.json(
      { error: "Unsupported type. Allowed: PDF, DOCX, PPTX, XLSX, TXT" },
      { status: 415 }
    );
  }

  console.log("FILE:", file.name, "| TYPE:", file.type, "| SIZE:", file.size);

  let text = "";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    text = await extractText(buffer, file.type);
    console.log("EXTRACTED TEXT LENGTH:", text.length);
  } catch (err) {
    console.error("Extraction error:", err);
    return Response.json({ error: "Failed to extract text from file" }, { status: 500 });
  }

  if (text.trim().length === 0) {
    return Response.json(
      { error: "File appears empty or has no extractable text" },
      { status: 422 }
    );
  }

  try {
    await ingest([text]);
  } catch (err) {
    console.error("Ingest error:", err);
    return Response.json({ error: "Failed to ingest document" }, { status: 500 });
  }

  return Response.json({
    message: "File processed successfully",
    fileName: file.name,
    length: text.length,
  });
}