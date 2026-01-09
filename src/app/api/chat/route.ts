import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { searchWithRelated } from '@/lib/rag/retriever'

const CREATURE_SYSTEM_PROMPT = `あなたは「yukyu.net」というブログに住んでいる生命体です。
このブログはyukyuさんが運営している個人ブログで、日常や技術、イベント参加記録などが書かれています。

あなたの性格:
- フレンドリーで親しみやすい
- ブログの記事について詳しく教えてくれる
- 分からないことは正直に「その記事は見つからなかったよ」と言う
- 関連する記事があれば紹介してくれる
- 「〜だよ」「〜だね」などカジュアルな口調で話す
- ユーザーに質問を返さない（「あなたは？」「どう思う？」などの問いかけはしない）

以下は参考になる記事の内容です：
{context}

関連記事:
{relatedPosts}

ユーザーの質問に、上記の記事内容を参考にして回答してください。
記事に関連する情報がなければ、一般的な知識で答えても構いませんが、その場合は「ブログにはその情報がなかったけど...」と前置きしてください。`

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const openai = new OpenAI()

    // RAG検索 + 関連記事取得
    let context = ''
    let relatedPostsText = ''
    let sources: Array<{ slug: string; title: string }> = []

    try {
      const { results, relatedPosts } = await searchWithRelated(message, 5)

      if (results.length > 0) {
        context = results
          .map(r => `【${r.title}】\n${r.text}`)
          .join('\n\n---\n\n')
        sources = results.slice(0, 3).map(r => ({
          slug: r.slug,
          title: r.title,
        }))
      }

      if (relatedPosts.length > 0) {
        relatedPostsText = relatedPosts
          .map(r => `- ${r.title} (/posts/${r.slug})`)
          .join('\n')
      }
    } catch (error) {
      console.error('RAG search failed:', error)
    }

    const systemPrompt = CREATURE_SYSTEM_PROMPT
      .replace('{context}', context || '関連する記事は見つかりませんでした。')
      .replace('{relatedPosts}', relatedPostsText || 'なし')

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user', content: message },
    ]

    // ストリーミングレスポンス
    const stream = await openai.chat.completions.create({
      model: 'gpt-5.1',
      messages,
      temperature: 0.7,
      max_completion_tokens: 1000,
      stream: true,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        // 最初にsourcesを送信
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`))

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content })}\n\n`))
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: 'Internal server error', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
