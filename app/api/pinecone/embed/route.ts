import { NextResponse } from "next/server";
import OpenAI from "openai";

import { getPineconeClient } from "@/lib/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ success: false, error: "Text is required" });
  }

  // 1. Get embedding from OpenAI
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const vector = embedding.data[0].embedding;

  // 2. Upsert to Pinecone
  const pinecone = getPineconeClient();
  const index = pinecone.index(process.env.PINECONE_INDEX as string);

  await index.upsert([
    {
      id: Date.now().toString(),
      values: vector,
      metadata: { text },
    },
  ]);

  return NextResponse.json({ success: true, });
}
