import { NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export async function POST(req: Request) {
    const { query } = await req.json();

    if (!query) {
        return NextResponse.json({ success: false, error: "Query is required" });
    }

    // 1. Embed query
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
    });

    const vector = embedding.data[0].embedding;

    // 2. Search Pinecone
    const pinecone = getPineconeClient();
    const index = pinecone.index(process.env.PINECONE_INDEX as string);

    const results = await index.query({
        vector: vector,
        topK: 5,
        includeMetadata: true,
    });

    return NextResponse.json(results.matches);
}