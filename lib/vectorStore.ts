import { getEmbedding } from "./embeddings";
import { documents } from "./documents";
import { hybridChunk } from "./chunk";

export const vectorStore: {
  text: string;
  embedding: number[];
}[] = [];

let initialized = false;

export async function initVectorStore() {
  if (initialized) return;

  console.log("INIT VECTOR STORE...");

  for (const doc of documents) {
    // 1. chunking step
    const chunks = hybridChunk(doc);

    for (const chunk of chunks) {
      //  2. embedding all chunk
      const embedding = await getEmbedding(chunk);

      vectorStore.push({
        text: chunk,
        embedding,
      });
    }
  }

  initialized = true;

  console.log("VECTOR STORE READY:", vectorStore.length);
}