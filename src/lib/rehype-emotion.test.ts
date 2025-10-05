import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeEmotion from './rehype-emotion'

describe('rehype-emotion', () => {
  it('should transform emotion tags with sadness', async () => {
    const markdown = '<emotion="sadness">悲しい文章</emotion>'

    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeEmotion)
      .use(rehypeStringify)
      .process(markdown)

    const html = result.toString()
    expect(html).toContain('class="emotion-wrapper"')
    expect(html).toContain('data-emotion="sadness"')
    expect(html).toContain('data-label="悲しみ"')
    expect(html).toContain('悲しい文章')
  })

  it('should transform emotion tags with happiness', async () => {
    const markdown = '<emotion="happiness">嬉しい文章</emotion>'

    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeEmotion)
      .use(rehypeStringify)
      .process(markdown)

    const html = result.toString()
    expect(html).toContain('data-emotion="happiness"')
    expect(html).toContain('data-label="喜び"')
  })

  it('should handle unknown emotion types', async () => {
    const markdown = '<emotion="unknown">未知の感情</emotion>'

    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeEmotion)
      .use(rehypeStringify)
      .process(markdown)

    const html = result.toString()
    expect(html).toContain('data-emotion="unknown"')
    expect(html).toContain('data-label="unknown"')
  })

  it('should work within paragraphs', async () => {
    const markdown = 'これは<emotion="sadness">悲しい文章</emotion>です。'

    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeEmotion)
      .use(rehypeStringify)
      .process(markdown)

    const html = result.toString()
    expect(html).toContain('これは')
    expect(html).toContain('class="emotion-wrapper"')
    expect(html).toContain('悲しい文章')
    expect(html).toContain('です。')
  })
})
