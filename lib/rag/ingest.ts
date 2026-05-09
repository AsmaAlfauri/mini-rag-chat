import { supabase } from "../db/supabase";
import { getEmbedding } from "../ai/embeddings";
import { hybridChunk } from "./chunk";
import { documents } from "../documents";


export async function ingest() {
  for (const doc of documents) {
    const chunks = hybridChunk(doc);

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      const { error } = await supabase.from("documents").insert({
        content: chunk,
        embedding,
      });

      if (error) {
        console.error("Insert error:", error);
      }
    }
  }
}