export const POSTS_PER_PAGE = 24

export function getPaginatedPosts<T>(posts: T[], page: number): T[] {
  const startIndex = (page - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  return posts.slice(startIndex, endIndex)
}

export function getTotalPages(totalPosts: number): number {
  return Math.ceil(totalPosts / POSTS_PER_PAGE)
}