import { getEmbedding } from "../ai/embeddings";
import { supabase } from "../db/supabase";
import { hybridChunk } from "./chunk";

const BATCH_SIZE = 50;

export async function ingest(docs: string[]) {
  const rows: any[] = [];

  for (const doc of docs) {
    const chunks = hybridChunk(doc);

    for (const chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk);
        rows.push({ content: chunk, embedding });
      } catch (err) {
        console.error("Embedding error for chunk:", chunk.slice(0, 50), err);
      }
    }
  }

  console.log(`Ingesting ${rows.length} chunks in batches of ${BATCH_SIZE}`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("documents").insert(batch);

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} error:`, error.message, error.details);
    } else {
      console.log(`Batch ${i / BATCH_SIZE + 1} inserted successfully`);
    }
  }
}