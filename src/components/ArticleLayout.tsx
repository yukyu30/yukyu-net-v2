import { ReactNode } from 'react'
import Link from 'next/link'
import Header from './Header'
import Footer from './Footer'
import '@/styles/article.css'

interface ArticleLayoutProps {
  title: string
  date: string
  content: string
}

export default function ArticleLayout({ title, date, content }: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header showBackButton={true} pageType="article" />

      <main className="container mx-auto px-0">
        <div className="border-l-2 border-r-2 border-black mx-4">
          <article className="max-w-4xl mx-auto">
            <div className="border-b-2 border-black">
              <div className="p-8">
                <div className="border-b border-black pb-4 mb-6">
                  <time className="text-xs font-mono uppercase">{date}</time>
                </div>
                <h1 className="text-3xl font-bold leading-tight">{title}</h1>
              </div>
            </div>
            
            <div className="p-8">
              <div 
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
            
            <div className="border-t-2 border-black">
              <div className="p-8 flex justify-between items-center">
                <Link href="/" className="text-sm font-mono uppercase hover:bg-black hover:text-white px-3 py-2 border border-black transition-colors">
                  ← RETURN TO INDEX
                </Link>
                <div className="text-xs font-mono">
                  END OF ARTICLE
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      
      <Footer variant="article" />
    </div>
  )
}