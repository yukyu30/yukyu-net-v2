'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getAllPosts } from '@/lib/posts'
import { searchPosts } from '@/lib/search'
import GridLayout from '@/components/GridLayout'
import PostCard from '@/components/PostCard'
import type { Post } from '@/lib/posts'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const posts = getAllPosts()
    setAllPosts(posts)

    if (query) {
      const searchResults = searchPosts(posts, query)
      setResults(searchResults)
    } else {
      setResults([])
    }

    setIsLoading(false)
  }, [query])

  return (
    <GridLayout
      postsCount={allPosts.length}
      lastUpdate={allPosts[0]?.date}
      showProfile={false}
    >
      <div className="col-span-full mb-8">
        <div className="border-2 border-green-400 p-6">
          <h2 className="text-2xl font-bold mb-2">検索結果</h2>
          {query && (
            <p className="text-sm font-mono">
              &quot;{query}&quot; の検索結果: {results.length}件
            </p>
          )}
          {!query && (
            <p className="text-sm font-mono text-gray-500">
              検索キーワードを入力してください
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-sm font-mono">読み込み中...</p>
        </div>
      ) : results.length > 0 ? (
        results.map((post, index) => (
          <PostCard key={post.slug} post={post} index={index} />
        ))
      ) : query ? (
        <div className="col-span-full text-center py-12">
          <p className="text-sm font-mono text-gray-500">
            該当する記事が見つかりませんでした
          </p>
        </div>
      ) : null}
    </GridLayout>
  )
}
