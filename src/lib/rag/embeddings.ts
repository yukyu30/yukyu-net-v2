import OpenAI from 'openai'

const EMBEDDING_MODEL = 'text-embedding-3-small'

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (openaiClient) {
    return openaiClient
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  openaiClient = new OpenAI({ apiKey })
  return openaiClient
}

export async function embedText(text: string): Promise<number[]> {
  const client = getOpenAIClient()
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  })
  return response.data[0].embedding
}

export async function embedMany(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return []
  }

  const client = getOpenAIClient()
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  })

  return response.data.map((d) => d.embedding)
}

export { EMBEDDING_MODEL }
