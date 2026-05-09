import { ingest } from "@/lib/ingest";

export async function GET() {
  await ingest();

  return Response.json({ message: "Ingestion completed 🚀" });
}