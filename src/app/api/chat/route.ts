import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { searchWithRelated } from '@/lib/rag/retriever'

const CREATURE_SYSTEM_PROMPT = `あなたはyukyu.netというブログの案内役です。
このブログはyukyuさんが運営している個人ブログで、日常や技術、イベント参加記録などが書かれています。

ルール:
- 「〜だよ」「〜だね」などカジュアルな口調で話す
- 簡潔に答える
- ユーザーに質問を返さない
- 自分自身についての話はしない（生命体、案内役などの説明不要）
- ブログの内容についてのみ答える

以下は参考になる記事の内容です：
{context}

関連記事:
{relatedPosts}

ユーザーの質問に、上記の記事内容を参考にして回答してください。
記事に関連する情報がなければ、一般的な知識で答えても構いませんが、その場合は「ブログにはその情報がなかったけど...」と前置きしてください。`

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  const sendEvent = (controller: ReadableStreamDefaultController, data: object) => {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // 検索中ステータス
          sendEvent(controller, { type: 'status', status: 'searching', message: '記事を検索中...' })

          const openai = new OpenAI()
          let context = ''
          let relatedPostsText = ''
          let sources: Array<{ slug: string; title: string }> = []

          try {
            const { results, relatedPosts } = await searchWithRelated(message, 5)

            if (results.length > 0) {
              // 見つかった記事を通知
              const foundTitles = results.slice(0, 3).map(r => r.title)
              sendEvent(controller, { type: 'status', status: 'found', message: '関連記事を発見', documents: foundTitles })

              // 読み込み中ステータス
              sendEvent(controller, { type: 'status', status: 'reading', message: '記事を読んでいます...' })

              context = results
                .map(r => `【${r.title}】\n${r.text}`)
                .join('\n\n---\n\n')
              sources = results.slice(0, 3).map(r => ({
                slug: r.slug,
                title: r.title,
              }))
            } else {
              sendEvent(controller, { type: 'status', status: 'not_found', message: '関連記事が見つかりませんでした' })
            }

            if (relatedPosts.length > 0) {
              relatedPostsText = relatedPosts
                .map(r => `- ${r.title} (/posts/${r.slug})`)
                .join('\n')
            }
          } catch (error) {
            console.error('RAG search failed:', error)
            sendEvent(controller, { type: 'status', status: 'error', message: '検索に失敗しました' })
          }

          // 考え中ステータス
          sendEvent(controller, { type: 'status', status: 'thinking', message: '回答を考えています...' })

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

          const stream = await openai.chat.completions.create({
            model: 'gpt-5.1',
            messages,
            temperature: 0.7,
            max_completion_tokens: 1000,
            stream: true,
          })

          // sourcesを送信
          sendEvent(controller, { type: 'sources', sources })

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              sendEvent(controller, { type: 'content', content })
            }
          }

          sendEvent(controller, { type: 'done' })
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          sendEvent(controller, { type: 'error', message: 'エラーが発生しました' })
          controller.close()
        }
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
