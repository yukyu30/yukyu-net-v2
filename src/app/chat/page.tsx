import { Metadata } from 'next'
import CreatureChat from '@/components/CreatureChat'
import MenuBar from '@/components/MenuBar'

export const metadata: Metadata = {
  title: 'DecoBoco Chat | yukyu.net',
  description: 'yukyuのブログについて聞いてみよう',
}

interface ChatPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { q } = await searchParams

  return (
    <>
      <MenuBar />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-green-400 mb-2">
            <span className="text-3xl mr-2">▛</span>
            DecoBoco Chat
          </h1>
          <p className="text-green-600 mb-8 text-sm">
            このブログについて聞いてみよう
          </p>
          <CreatureChat initialQuery={q} />
        </div>
      </main>
    </>
  )
}
