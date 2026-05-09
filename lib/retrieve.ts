import { vectorStore, initVectorStore } from "./vectorStore";
import { getEmbedding } from "./embeddings";
import { cosineSimilarity } from "./math";

export async function retrieve(question: string) {
  await initVectorStore();

  console.log("VECTOR STORE CHECK:", vectorStore.length);

  const qEmbedding = await getEmbedding(question);

  const scored = vectorStore.map((item) => ({
    text: item.text,
    score: cosineSimilarity(qEmbedding, item.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.text);
}