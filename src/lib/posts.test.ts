import { getAllPosts, getPostBySlug } from './posts'
import fs from 'fs'
import path from 'path'

describe('記事一覧を取得する関数', () => {
  describe('getAllPosts', () => {
    test('記事一覧が取得できること', () => {
      const posts = getAllPosts()
      expect(posts).toBeDefined()
      expect(Array.isArray(posts)).toBe(true)
      expect(posts.length).toBeGreaterThan(0)
    })

    test('記事が日付順（新しい順）にソートされていること', () => {
      const posts = getAllPosts()
      for (let i = 0; i < posts.length - 1; i++) {
        const current = new Date(posts[i].date)
        const next = new Date(posts[i + 1].date)
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime())
      }
    })

    test('記事のメタデータ（title, date, excerpt）が取得できること', () => {
      const posts = getAllPosts()
      const firstPost = posts[0]
      expect(firstPost).toHaveProperty('title')
      expect(firstPost).toHaveProperty('date')
      expect(firstPost).toHaveProperty('excerpt')
    })

    test('記事のslugが取得できること', () => {
      const posts = getAllPosts()
      const firstPost = posts[0]
      expect(firstPost).toHaveProperty('slug')
      expect(typeof firstPost.slug).toBe('string')
    })

    test('READMEやmeなどの特殊なディレクトリが除外されること', () => {
      const posts = getAllPosts()
      const hasReadme = posts.some(post => post.slug === 'README')
      const hasMe = posts.some(post => post.slug === 'me')
      const hasPrivacyPolicy = posts.some(post => post.slug === 'privacy-policy')
      expect(hasReadme).toBe(false)
      expect(hasMe).toBe(false)
      expect(hasPrivacyPolicy).toBe(false)
    })
  })
})

describe('記事詳細を取得する関数', () => {
  describe('getPostBySlug', () => {
    test('指定したslugの記事が取得できること', async () => {
      const post = await getPostBySlug('2025-06-30')
      expect(post).toBeDefined()
      expect(post).not.toBeNull()
    })

    test('記事の本文がHTMLに変換されていること', async () => {
      const post = await getPostBySlug('2025-06-30')
      expect(post).toHaveProperty('content')
      expect(post?.content).toContain('<')
      expect(post?.content).toContain('>')
    })

    test('記事のメタデータが取得できること', async () => {
      const post = await getPostBySlug('2025-06-30')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('date')
      expect(post).toHaveProperty('slug')
    })

    test('存在しないslugの場合はnullが返ること', async () => {
      const post = await getPostBySlug('not-exist-slug')
      expect(post).toBeNull()
    })

    test('画像パスが適切に処理されること', async () => {
      const post = await getPostBySlug('2025-06-30')
      if (post?.content) {
        const hasAbsolutePath = post.content.includes('/public_articles/source/2025-06-30/')
        expect(hasAbsolutePath).toBe(true)
      }
    })
  })
})