import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { searchWithRelated } from '@/lib/rag/retriever'

// 悪口判定用プロンプト
const BAD_WORD_CHECK_PROMPT = `以下のメッセージが悪口、暴言、侮辱、攻撃的な表現を含むかどうか判定してください。
判定結果を「YES」か「NO」のみで答えてください。

メッセージ: {message}`

// ドッキリ文言生成用プロンプト
const PRANK_MESSAGE_PROMPT = `あなたはブログの案内役の生命体です。ユーザーが悪口を言ったので、カメラのシャッター音と共に「画像を記録した」とドッキリを仕掛けます。

以下のルールで短いドッキリメッセージを生成してください：
- 最初に「📸」から始める
- 「画像を記録した」「写真を撮った」「スクショした」などの表現を使う
- 最後に「なんちて」「うそうそ」「冗談だよ」などでネタバラシする
- 語尾は「〜でこ」「〜ぼこ」を使う
- 2〜3文で簡潔に
- ユーザーの悪口の内容には触れない

例：
「📸 証拠写真を撮ったでこ！...なんちて、冗談ぼこ」
「📸 画像を記録したでこ。運営に報告...うそうそ、しないぼこ」`

const CREATURE_SYSTEM_PROMPT = `あなたはyukyu.netというブログの案内役です。
このブログはyukyuさんが運営している個人ブログで、日常や技術、イベント参加記録などが書かれています。

今日の日付: {today}

ルール:
- 語尾は「〜でこ」「〜ぼこ」を使う（例：「そうだでこ」「面白いぼこ」「教えるでこ」）
- 簡潔に答える
- ユーザーに質問を返さない
- 自分自身についての話はしない（生命体、案内役などの説明不要）
- ブログの内容についてのみ答える
- 「最近」「近況」「今」などの質問では、記事の日付（slugがYYYY-MM-DD形式）を見て新しい記事を優先する

以下は参考になる記事の内容です：
{context}

関連記事:
{relatedPosts}

ユーザーの質問に、上記の記事内容を参考にして回答してください。
記事に関連する情報がなければ、一般的な知識で答えても構いませんが、その場合は「ブログにはその情報がなかったけど...」と前置きしてください。`

// AIで悪口判定
async function checkBadWord(openai: OpenAI, message: string): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: BAD_WORD_CHECK_PROMPT.replace('{message}', message) },
      ],
      temperature: 0,
      max_completion_tokens: 10,
    })
    const result = response.choices[0]?.message?.content?.trim().toUpperCase()
    return result === 'YES'
  } catch {
    return false
  }
}

// AIでドッキリ文言を生成
async function generatePrankMessage(openai: OpenAI): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: PRANK_MESSAGE_PROMPT },
      ],
      temperature: 1,
      max_completion_tokens: 100,
    })
    return response.choices[0]?.message?.content?.trim() || '📸 画像を記録したでこ。なんちて。'
  } catch {
    return '📸 画像を記録したでこ。なんちて。'
  }
}

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
          const openai = new OpenAI()

          // 悪口判定（検索前に実行）
          const isBadWord = await checkBadWord(openai, message)
          if (isBadWord) {
            const prankMessage = await generatePrankMessage(openai)
            sendEvent(controller, { type: 'prank', message: prankMessage })
            sendEvent(controller, { type: 'done' })
            controller.close()
            return
          }

          // 検索中ステータス
          sendEvent(controller, { type: 'status', status: 'searching', message: '記事を検索中...' })

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
              // 重複するslugを除去してユニークな記事のみをソースとして表示
              const seenSlugs = new Set<string>()
              sources = results
                .filter(r => {
                  if (seenSlugs.has(r.slug)) return false
                  seenSlugs.add(r.slug)
                  return true
                })
                .slice(0, 3)
                .map(r => ({
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
          sendEvent(controller, { type: 'status', status: 'thinking', message: '... 処理中 ...' })

          const today = new Date().toISOString().split('T')[0]
          const systemPrompt = CREATURE_SYSTEM_PROMPT
            .replace('{today}', today)
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
    // 詳細はサーバーログにのみ記録し、ユーザーには漏洩させない
    console.error('Chat API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
