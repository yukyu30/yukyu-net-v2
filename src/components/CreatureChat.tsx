'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getFramesForStatus, getAnimationSpeed, type ChatStatus } from '@/lib/creature-frames'

interface Source {
  slug: string
  title: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

const HISTORY_LIMIT = 6
const PROSE_CLASSES = "prose prose-invert prose-sm max-w-none [&_p]:my-1 [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:ml-4 [&_ol]:list-decimal [&_li]:my-0.5 [&_li]:text-green-400 [&_h1]:text-green-300 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-1 [&_h2]:text-green-300 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-green-300 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-green-300 [&_strong]:font-bold [&_em]:text-green-500 [&_code]:text-green-300 [&_code]:bg-green-900/30 [&_code]:px-1 [&_code]:rounded [&_a]:text-green-400 [&_a]:underline"

function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null
  return (
    <div className="mt-3 pt-2 border-t border-green-900">
      <p className="text-xs text-green-700 mb-1">参考にした記事:</p>
      <ul className="text-xs space-y-1">
        {sources.map((src, j) => (
          <li key={j}>
            <Link href={`/posts/${src.slug}`} className="text-green-500 hover:text-green-300 underline">
              {src.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface StatusInfo {
  status: string
  message: string
  documents?: string[]
}

interface CreatureChatProps {
  initialQuery?: string
}

export default function CreatureChat({ initialQuery }: CreatureChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [creatureFrame, setCreatureFrame] = useState(getFramesForStatus('idle')[0])
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingSources, setStreamingSources] = useState<Source[]>([])
  const [currentStatus, setCurrentStatus] = useState<StatusInfo | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialQuerySent = useRef(false)
  const messagesRef = useRef<Message[]>([])
  const isLoadingRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showFlash, setShowFlash] = useState(false)

  // フラッシュと音声の演出フック
  const playPrankEffect = useCallback(() => {
    // カメラシャッター音を再生
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/camera-shutter.mp3')
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})

    // フラッシュ演出
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 150)
  }, [])

  // ステータスに応じたフレームアニメーション
  useEffect(() => {
    let frameIndex = 0

    // 現在のステータスを決定
    const getCurrentStatus = (): ChatStatus => {
      if (currentStatus?.status) {
        return currentStatus.status as ChatStatus
      }
      if (streamingContent) {
        return 'thinking' // ストリーミング中は思考アニメーション
      }
      if (isLoading) {
        return 'searching' // ローディング中で状態がなければ検索アニメーション
      }
      return 'idle'
    }

    const status = getCurrentStatus()
    const frames = getFramesForStatus(status)
    const speed = getAnimationSpeed(status)

    const interval = setInterval(() => {
      frameIndex = (frameIndex + 1) % frames.length
      setCreatureFrame(frames[frameIndex])
    }, speed)

    return () => clearInterval(interval)
  }, [isLoading, currentStatus, streamingContent])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent, currentStatus])

  // messagesRef を同期
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const sendMessage = useCallback(async (userMessage: string, options?: { onPrank?: () => void }) => {
    if (!userMessage.trim() || isLoadingRef.current) return

    isLoadingRef.current = true
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    setStreamingContent('')
    setStreamingSources([])
    setCurrentStatus(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messagesRef.current.slice(-HISTORY_LIMIT),
        }),
      })

      if (!response.ok) throw new Error('Chat failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let accumulatedContent = ''
      let sources: Source[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'prank') {
                // AIが悪口を検出したのでドッキリ発動
                options?.onPrank?.()
                // prankメッセージをcontentとして扱う
                accumulatedContent = data.message
              } else if (data.type === 'status') {
                setCurrentStatus({
                  status: data.status,
                  message: data.message,
                  documents: data.documents,
                })
              } else if (data.type === 'sources') {
                sources = data.sources
                setStreamingSources(data.sources)
                setCurrentStatus(null) // ステータス表示を消す
              } else if (data.type === 'content') {
                accumulatedContent += data.content
                setStreamingContent(accumulatedContent)
              } else if (data.type === 'done') {
                // コンテンツがある場合のみメッセージを追加（prankの場合は空）
                if (accumulatedContent) {
                  setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: accumulatedContent, sources },
                  ])
                }
                setStreamingContent('')
                setStreamingSources([])
                setCurrentStatus(null)
              }
            } catch {
              // JSON parse error, skip
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'ごめん、うまく答えられなかった...もう一度聞いてみて！' },
      ])
      setStreamingContent('')
      setStreamingSources([])
      setCurrentStatus(null)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  // 初期クエリがある場合は自動送信
  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true
      sendMessage(`「${initialQuery}」について教えて`, { onPrank: playPrankEffect })
    }
  }, [initialQuery, sendMessage, playPrankEffect])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    inputRef.current?.focus()
    sendMessage(userMessage, { onPrank: playPrankEffect })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* フラッシュ演出 */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[100] pointer-events-none" />
      )}

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
        {messages.length === 0 && !streamingContent && !currentStatus && (
          <div className="text-center text-green-700 py-8">
            <span data-testid="creature-frame" className="text-6xl block mb-4">{creatureFrame}</span>
            <p>何でも聞いてね！</p>
            <p className="text-sm mt-2 text-green-800">ブログの記事について教えてあげるよ</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-green-900 text-green-100' : 'bg-gray-900 text-green-400 border border-green-900'}`}>
              {msg.role === 'assistant' && !msg.content.startsWith('📸') && <span className="text-xl mr-2">{creatureFrame}</span>}
              {msg.role === 'assistant' ? (
                <div className={PROSE_CLASSES}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              )}
              {msg.sources && <SourcesList sources={msg.sources} />}
            </div>
          </div>
        ))}

        {/* ステータス表示 */}
        {currentStatus && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-gray-900 text-green-400 border border-green-900 rounded-lg p-3">
              <span className="text-xl mr-2">{creatureFrame}</span>
              <span className="text-green-600">{currentStatus.message}</span>
              {currentStatus.documents && currentStatus.documents.length > 0 && (
                <ul className="mt-2 text-xs text-green-700 space-y-1">
                  {currentStatus.documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-green-500">→</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ストリーミング中の回答 */}
        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-900 text-green-400 border border-green-900 rounded-lg p-3">
              <span className="text-xl mr-2">{creatureFrame}</span>
              <div className={PROSE_CLASSES}>
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
              <SourcesList sources={streamingSources} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-green-900 bg-black">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "応答中..." : "メッセージを入力..."}
            className="flex-1 bg-gray-900 border border-green-900 rounded-lg px-4 py-3 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-700"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-900 hover:bg-green-800 disabled:bg-gray-900 disabled:text-green-900 text-green-400 px-6 py-3 rounded-lg transition-colors"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  )
}
