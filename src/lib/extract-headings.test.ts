import { extractHeadings, Heading } from './extract-headings'

describe('extractHeadings', () => {
  it('should extract h2 and h3 headings from HTML', () => {
    const html = `
      <h2 id="section-1">セクション1</h2>
      <p>本文...</p>
      <h3 id="subsection-1">サブセクション1</h3>
      <p>本文...</p>
      <h2 id="section-2">セクション2</h2>
    `

    const headings = extractHeadings(html)

    expect(headings).toEqual([
      { id: 'section-1', text: 'セクション1', level: 2 },
      { id: 'subsection-1', text: 'サブセクション1', level: 3 },
      { id: 'section-2', text: 'セクション2', level: 2 },
    ])
  })

  it('should return empty array when no headings exist', () => {
    const html = '<p>本文のみ</p>'

    const headings = extractHeadings(html)

    expect(headings).toEqual([])
  })

  it('should handle headings without id', () => {
    const html = '<h2>見出しテキスト</h2>'

    const headings = extractHeadings(html)

    expect(headings).toEqual([
      { id: '', text: '見出しテキスト', level: 2 },
    ])
  })

  it('should ignore h1 headings (used for title)', () => {
    const html = `
      <h1 id="title">タイトル</h1>
      <h2 id="section">セクション</h2>
    `

    const headings = extractHeadings(html)

    expect(headings).toEqual([
      { id: 'section', text: 'セクション', level: 2 },
    ])
  })
})
