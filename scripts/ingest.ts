import { ingest } from "../lib/rag/ingest";

async function run() {
  await ingest();
  console.log("Ingestion done 🚀");
}

run();