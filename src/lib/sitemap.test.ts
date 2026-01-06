import { generateSitemapEntries, SITE_URL } from './sitemap'
import { getTotalPages } from './pagination'

jest.mock('./posts', () => ({
  getAllPosts: jest.fn(() => [
    { slug: '2025-01-01', title: 'テスト記事1', date: '2025-01-01', tags: ['日記'] },
    { slug: '2024-12-31', title: 'テスト記事2', date: '2024-12-31', tags: ['技術'] },
    { slug: '2024-12-30', title: 'テスト記事3', date: '2024-12-30', tags: ['日記', '技術'] },
  ]),
  getAllTags: jest.fn(() => new Map([
    ['日記', 2],
    ['技術', 2],
  ])),
}))

import { getAllPosts, getAllTags } from './posts'

describe('sitemap生成関数', () => {
  describe('generateSitemapEntries', () => {
    test('配列を返すこと', () => {
      const entries = generateSitemapEntries()
      expect(entries).toBeDefined()
      expect(Array.isArray(entries)).toBe(true)
    })

    test('ホームページが含まれること', () => {
      const entries = generateSitemapEntries()
      const homeEntry = entries.find(e => e.url === SITE_URL)
      expect(homeEntry).toBeDefined()
      expect(homeEntry?.changeFrequency).toBe('daily')
      expect(homeEntry?.priority).toBe(1)
    })

    test('全記事ページが含まれること', () => {
      const entries = generateSitemapEntries()
      const posts = getAllPosts()

      posts.forEach(post => {
        const postEntry = entries.find(e => e.url === `${SITE_URL}/posts/${post.slug}`)
        expect(postEntry).toBeDefined()
      })
    })

    test('記事のlastModifiedが設定されていること', () => {
      const entries = generateSitemapEntries()
      const posts = getAllPosts()

      const firstPost = posts[0]
      const postEntry = entries.find(e => e.url === `${SITE_URL}/posts/${firstPost.slug}`)
      expect(postEntry?.lastModified).toBeDefined()
    })

    test('静的ページ（works, tags, status）が含まれること', () => {
      const entries = generateSitemapEntries()

      const worksEntry = entries.find(e => e.url === `${SITE_URL}/works`)
      expect(worksEntry).toBeDefined()

      const tagsEntry = entries.find(e => e.url === `${SITE_URL}/tags`)
      expect(tagsEntry).toBeDefined()

      const statusEntry = entries.find(e => e.url === `${SITE_URL}/status`)
      expect(statusEntry).toBeDefined()
    })

    test('各タグページが含まれること', () => {
      const entries = generateSitemapEntries()
      const tags = getAllTags()

      tags.forEach((_, tagName) => {
        const tagEntry = entries.find(e => e.url === `${SITE_URL}/tags/${encodeURIComponent(tagName)}`)
        expect(tagEntry).toBeDefined()
      })
    })

    test('ページネーションページが含まれること', () => {
      const entries = generateSitemapEntries()
      const posts = getAllPosts()
      const totalPages = getTotalPages(posts.length)

      // ページ2以降が含まれること（ページ1はホームページ）
      for (let i = 2; i <= totalPages; i++) {
        const pageEntry = entries.find(e => e.url === `${SITE_URL}/page/${i}`)
        expect(pageEntry).toBeDefined()
      }
    })

    test('URLがhttps://yukyu.netで始まること', () => {
      const entries = generateSitemapEntries()
      entries.forEach(entry => {
        expect(entry.url).toMatch(/^https:\/\/yukyu\.net/)
      })
    })
  })

  describe('SITE_URL', () => {
    test('正しいベースURLが設定されていること', () => {
      expect(SITE_URL).toBe('https://yukyu.net')
    })
  })
})
