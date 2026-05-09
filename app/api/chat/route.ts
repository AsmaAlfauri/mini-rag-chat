import OpenAI from "openai";
import { retrieve } from "@/lib/retrieve";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const contextDocs = await retrieve(message);

  const context = contextDocs.join("\n");

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Answer ONLY using the context.",
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${message}
        `,
      },
    ],
  });

  return Response.json({
    answer: res.choices[0].message.content,
    context: contextDocs,
  });
}