
import { ingest } from "@/lib/rag/ingest";
import pdf from "pdf-parse";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const data = await pdf(buffer);
  const text = data.text;

  if (!text) {
    return Response.json({ error: "No text found in PDF" }, { status: 400 });
  }

  await ingest([text]);

  return Response.json({
    message: "PDF processed successfully",
    length: text.length,
  });
}