import Link from 'next/link'
import { Post } from '@/lib/posts'

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const borderClasses = `${
    index === 0
      ? ''
      : index === 1
        ? 'border-t-2 md:border-t-0 lg:border-t-0'
        : index === 2
          ? 'border-t-2 md:border-t-2 lg:border-t-0'
          : 'border-t-2'
  } border-black ${
    (index + 1) % 3 !== 0 ? 'lg:border-r-2' : ''
  } ${
    (index + 1) % 2 !== 0 ? 'md:border-r-2' : 'md:border-r-0'
  } ${(index + 1) % 3 !== 0 ? '' : 'lg:border-r-0'}`

  return (
    <article className={borderClasses}>
      <Link href={`/posts/${post.slug}`} className="block h-full">
        <div className="p-6 hover:bg-gray-50 transition-colors h-full flex flex-col">
          <div className="border-b border-black pb-2 mb-3">
            <time className="text-xs font-mono">{post.date}</time>
          </div>
          <h2 className="text-lg font-bold mb-3 leading-tight">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed line-clamp-4 flex-grow">
            {post.excerpt}
          </p>
          <div className="mt-4 pt-3 border-t border-gray-300">
            <span className="text-xs font-mono uppercase">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}