import { Metadata } from 'next'
import CreatureChat from '@/components/CreatureChat'

export const metadata: Metadata = {
  title: 'Chat with Creature | yukyu.net',
  description: 'yukyuのブログに住む生命体とおしゃべり',
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-green-400 mb-2">
          <span className="text-3xl mr-2">▛</span>
          Creature Chat
        </h1>
        <p className="text-green-600 mb-8 text-sm">
          このブログに住んでいる生命体に話しかけてみよう
        </p>
        <CreatureChat />
      </div>
    </main>
  )
}
