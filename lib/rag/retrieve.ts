import { supabase } from "../db/supabase";
import { getEmbedding } from "../ai/embeddings";

export async function retrieve(question: string) {
  const qEmbedding = await getEmbedding(question);

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: qEmbedding,
    match_threshold: 0.2,
    match_count: 3,
  });

  if (error) {
    console.error(error);
    return [];
  }
console.log("EMBEDDING LENGTH:", qEmbedding.length);
  return data.map((item: any) => item.content);
}