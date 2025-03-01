import { generateEmbedding } from "@/lib/embedding";
import { searchSimilar } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {jobDescription} = await request.json();

    const  jobDescriptionEmbedding = await generateEmbedding(jobDescription);

    const getTopList = await searchSimilar(jobDescriptionEmbedding, 5);

    return NextResponse.json(getTopList);

}