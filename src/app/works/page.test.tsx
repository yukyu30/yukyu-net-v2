import { render, screen } from '@testing-library/react'
import WorksPage from './page'
import { getPostsByTag } from '@/lib/posts'

jest.mock('@/lib/posts', () => ({
  getPostsByTag: jest.fn(),
}))

jest.mock('@/components/GridLayout', () => {
  return function MockGridLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="grid-layout">{children}</div>
  }
})

jest.mock('@/components/PostCard', () => {
  return function MockPostCard({ post }: { post: any }) {
    return <div data-testid="post-card">{post.title}</div>
  }
})

describe('WorksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('workタグを持つ記事を表示する', () => {
    const mockPosts = [
      {
        slug: '2025-01-11',
        title: 'いままでSUZURIでやってきたこと',
        date: '2025-01-11',
        excerpt: 'SUZURIでの仕事の振り返り...',
        tags: ['日記', '振り返り', 'work'],
      },
      {
        slug: '2024-12-31-showreel',
        title: 'showreel 2024を作った',
        date: '2024-12-31',
        excerpt: '映像作品をまとめました...',
        tags: ['日記', 'work'],
      },
    ]

    ;(getPostsByTag as jest.Mock).mockReturnValue(mockPosts)

    render(<WorksPage />)

    expect(getPostsByTag).toHaveBeenCalledWith('work')
    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
    expect(screen.getByText('いままでSUZURIでやってきたこと')).toBeInTheDocument()
    expect(screen.getByText('showreel 2024を作った')).toBeInTheDocument()
  })

  it('workタグの記事がない場合も正常に動作する', () => {
    ;(getPostsByTag as jest.Mock).mockReturnValue([])

    render(<WorksPage />)

    expect(getPostsByTag).toHaveBeenCalledWith('work')
    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
    expect(screen.queryByTestId('post-card')).not.toBeInTheDocument()
  })
})