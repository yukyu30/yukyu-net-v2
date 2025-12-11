import { render, screen } from '@testing-library/react'
import PostCard from '../PostCard'
import { Post } from '@/lib/posts'

describe('PostCard', () => {
  const mockPost: Post = {
    slug: 'test-post',
    title: 'テスト投稿',
    date: '2025-01-01',
    excerpt: 'これはテスト投稿の抜粋です。'
  }

  it('記事カードを正しく表示する', () => {
    const { container } = render(<PostCard post={mockPost} index={0} />)

    expect(screen.getByText('テスト投稿')).toBeInTheDocument()
    expect(screen.getByText('2025-01-01')).toBeInTheDocument()
    expect(screen.getByText('これはテスト投稿の抜粋です。')).toBeInTheDocument()
    // "Read" と "→" が別要素に分かれているためtextContentで確認
    expect(container.textContent).toContain('Read')
    expect(container.textContent).toContain('→')
  })

  it('最初の記事には上部ボーダーがない', () => {
    const { container } = render(<PostCard post={mockPost} index={0} />)
    const article = container.querySelector('article')
    
    expect(article?.className).not.toContain('border-t-2')
  })

  it('2番目以降の記事には上部ボーダーがある', () => {
    const { container } = render(<PostCard post={mockPost} index={3} />)
    const article = container.querySelector('article')
    
    expect(article?.className).toContain('border-t-2')
  })
})