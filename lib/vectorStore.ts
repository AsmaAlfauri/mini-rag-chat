import { getEmbedding } from "./embeddings";
import { documents } from "./documents";

export const vectorStore: {
  text: string;
  embedding: number[];
}[] = [];

let initialized = false;

export async function initVectorStore() {
  if (initialized) return;

  console.log("INIT VECTOR STORE...");

  for (const doc of documents) {
    const embedding = await getEmbedding(doc);

    vectorStore.push({
      text: doc,
      embedding,
    });
  }

  initialized = true;

  console.log("VECTOR STORE READY:", vectorStore.length);
}