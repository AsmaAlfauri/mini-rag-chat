
import { getEmbedding } from "../ai/embeddings";
import { supabase } from "../db/supabase";
import { hybridChunk } from "./chunk";

export async function ingest(docs: string[]) {
  const rows: any[] = [];

  for (const doc of docs) {
    const chunks = hybridChunk(doc);

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      rows.push({
        content: chunk,
        embedding,
      });
    }
  }

  const { error } = await supabase.from("documents").insert(rows);

  if (error) {
    console.error("❌ Supabase insert error:", error);
  }
}