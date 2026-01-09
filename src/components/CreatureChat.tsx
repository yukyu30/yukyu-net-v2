'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const CREATURE_FRAMES = ['▘', '▝', '▗', '▖']
const THINKING_FRAMES = ['▚', '▞']

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ slug: string; title: string }>
}

interface CreatureChatProps {
  initialQuery?: string
}

export default function CreatureChat({ initialQuery }: CreatureChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [creatureFrame, setCreatureFrame] = useState(CREATURE_FRAMES[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialQuerySent = useRef(false)

  useEffect(() => {
    let frameIndex = 0
    const interval = setInterval(() => {
      const frames = isLoading ? THINKING_FRAMES : CREATURE_FRAMES
      frameIndex = (frameIndex + 1) % frames.length
      setCreatureFrame(frames[frameIndex])
    }, isLoading ? 150 : 500)
    return () => clearInterval(interval)
  }, [isLoading])

  // 初期クエリがある場合は自動送信
  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true
      sendMessage(`「${initialQuery}」について教えて`)
    }
  }, [initialQuery])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
        }),
      })
      if (!response.ok) throw new Error('Chat failed')
      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, sources: data.sources },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'ごめん、うまく答えられなかった...もう一度聞いてみて！' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput('')
    await sendMessage(userMessage)
  }

  return (
    <div className="flex flex-col h-[70vh] border border-green-900 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-green-700 py-8">
            <span className="text-6xl block mb-4">{creatureFrame}</span>
            <p>何でも聞いてね！</p>
            <p className="text-sm mt-2 text-green-800">ブログの記事について教えてあげるよ</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-green-900 text-green-100' : 'bg-gray-900 text-green-400 border border-green-900'}`}>
              {msg.role === 'assistant' && <span className="text-xl mr-2">{creatureFrame}</span>}
              <span className="whitespace-pre-wrap">{msg.content}</span>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-green-900">
                  <p className="text-xs text-green-700 mb-1">参考にした記事:</p>
                  <ul className="text-xs space-y-1">
                    {msg.sources.map((src, j) => (
                      <li key={j}>
                        <Link href={`/posts/${src.slug}`} className="text-green-500 hover:text-green-300 underline">
                          {src.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 text-green-400 border border-green-900 rounded-lg p-3">
              <span className="text-xl mr-2">{creatureFrame}</span>
              <span className="animate-pulse">考え中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-green-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-900 border border-green-900 rounded-lg px-4 py-2 text-green-400 placeholder-green-800 focus:outline-none focus:border-green-700"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-green-900 hover:bg-green-800 disabled:bg-gray-900 disabled:text-green-900 text-green-400 px-4 py-2 rounded-lg transition-colors"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  )
}
