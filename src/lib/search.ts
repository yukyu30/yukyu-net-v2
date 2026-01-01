import Fuse from 'fuse.js'
import { Post } from './posts'

export interface SearchOptions {
  threshold?: number
  keys?: string[]
}

const defaultOptions: Fuse.IFuseOptions<Post> = {
  threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.3 },
    { name: 'excerpt', weight: 0.2 },
  ],
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

export function searchPosts(posts: Post[], query: string, options?: SearchOptions): Post[] {
  if (!query || query.trim().length === 0) {
    return posts
  }

  const fuseOptions = {
    ...defaultOptions,
    ...(options?.threshold && { threshold: options.threshold }),
    ...(options?.keys && { keys: options.keys }),
  }

  const fuse = new Fuse(posts, fuseOptions)
  const results = fuse.search(query)

  return results.map(result => result.item)
}
