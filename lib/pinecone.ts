import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const indexName = 'quickstart';


const index = pc.Index(indexName);

export async function storeEmbedding( embedding: number[], name: string, email: string, linkedin: string, skills: string) {
  await index.upsert([{ id: email, values: embedding,metadata:{name,email,linkedin,skills} }]);
}

export async function searchSimilar(embedding: number[], topK = 30) {
  return await index.query({
    vector: embedding,
    includeMetadata: true,
    topK,
    includeValues: true
  });
}

export async function addScoreMetaData(email: string, score : string) {
  await index.update({
    id: email,
    metadata : {"score": score}
  });
}