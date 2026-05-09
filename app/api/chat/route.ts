import OpenAI from "openai";
import { NextResponse } from "next/server";
import { retrieveRelevantDocs } from "@/lib/retrieve";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { message } = body;

    // 1. retrieve relevant docs
    const relevantDocs = retrieveRelevantDocs(message);

    // 2. build context
    const context = relevantDocs.join("\n");

    // 3. send to GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Answer ONLY using the provided context.",
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

    const answer =
      completion.choices[0].message.content;

    return NextResponse.json({
      answer,
      context: relevantDocs,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}