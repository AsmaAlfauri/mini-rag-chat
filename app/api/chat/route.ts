export const runtime = "nodejs";

import OpenAI from "openai";
import { retrieve } from "@/lib/rag/retrieve";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { message } = await req.json();
  const contextDocs = await retrieve(message);
  const context = contextDocs.join("\n\n");

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          stream: true,
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant. Answer the user's question using the provided context.
- If the context contains the answer, use it and respond in the same language as the user's question.
- If the context doesn't contain enough information, say so honestly.
- Be detailed and helpful.`,
            },
            {
              role: "user",
              content: `Context:\n${context}\n\nQuestion:\n${message}`,
            },
          ],
        });

        for await (const chunk of stream) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
      } catch (err) {
        console.error("Stream error:", err);
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}