import { render, screen } from '@testing-library/react'
import TableOfContents from '../TableOfContents'
import type { Heading } from '@/lib/extract-headings'

describe('TableOfContents', () => {
  it('見出しリストから目次を表示する', () => {
    const headings: Heading[] = [
      { id: 'heading-0', text: 'セクション1', level: 2 },
      { id: 'heading-1', text: 'サブセクション', level: 3 },
      { id: 'heading-2', text: 'セクション2', level: 2 },
    ]

    render(<TableOfContents headings={headings} />)

    expect(screen.getByText(/INDEX/)).toBeInTheDocument()
    expect(screen.getByText(/セクション1/)).toBeInTheDocument()
    expect(screen.getByText(/サブセクション/)).toBeInTheDocument()
    expect(screen.getByText(/セクション2/)).toBeInTheDocument()
  })

  it('アンカーリンクが正しく設定されている', () => {
    const headings: Heading[] = [
      { id: 'heading-0', text: 'テスト見出し', level: 2 },
    ]

    render(<TableOfContents headings={headings} />)

    const link = screen.getByRole('link', { name: /テスト見出し/ })
    expect(link).toHaveAttribute('href', '#heading-0')
  })

  it('見出しがない場合は何も表示しない', () => {
    render(<TableOfContents headings={[]} />)

    expect(screen.queryByText(/INDEX/)).not.toBeInTheDocument()
  })

  it('h3見出しはインデントされる', () => {
    const headings: Heading[] = [
      { id: 'heading-0', text: '大見出し', level: 2 },
      { id: 'heading-1', text: '小見出し', level: 3 },
    ]

    render(<TableOfContents headings={headings} />)

    const h3Link = screen.getByRole('link', { name: /小見出し/ })
    expect(h3Link.closest('li')).toHaveClass('ml-4')
  })
})
