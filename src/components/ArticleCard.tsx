import Link from 'next/link'
import { Post } from '@/lib/posts'

interface ArticleCardProps {
  post: Post
  index: number
}

export default function ArticleCard({ post, index }: ArticleCardProps) {
  const getDateDisplay = (date: string) => {
    return date.split('T')[0]
  }

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className={`
        border-b-2 border-black
        ${index % 3 !== 2 ? 'lg:border-r-2' : ''}
        ${index % 2 !== 1 ? 'md:border-r-2 lg:border-r-2' : 'md:border-r-2 lg:border-r-0'}
        p-6 hover:bg-black hover:text-white transition-colors h-full
      `}>
        <div className="flex flex-col h-full">
          <div className="mb-3">
            <time className="text-xs font-mono opacity-70">
              {getDateDisplay(post.date)}
            </time>
          </div>
          
          <h2 className="text-lg font-bold mb-3 line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-sm opacity-80 line-clamp-3 flex-grow">
            {post.excerpt}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono opacity-60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}