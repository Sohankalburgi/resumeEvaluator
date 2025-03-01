export async function generateEmbedding(text: string) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY || ''
        },
        body: JSON.stringify({
            content: { parts: [{ text }] }
        })
    });
    const data = await response.json();
    return data.embedding.values;
}