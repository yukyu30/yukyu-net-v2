import rehypeHeadingId from './rehype-heading-id'
import type { Root, Element } from 'hast'

describe('rehype-heading-id', () => {
  it('should add id to h2 headings', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h2',
          properties: {},
          children: [{ type: 'text', value: 'セクション1' }],
        },
      ],
    }

    const plugin = rehypeHeadingId()
    plugin(tree)

    const h2 = tree.children[0] as Element
    expect(h2.properties?.id).toBe('heading-0')
  })

  it('should add id to h3 headings', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h3',
          properties: {},
          children: [{ type: 'text', value: 'サブセクション' }],
        },
      ],
    }

    const plugin = rehypeHeadingId()
    plugin(tree)

    const h3 = tree.children[0] as Element
    expect(h3.properties?.id).toBe('heading-0')
  })

  it('should increment id for multiple headings', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h2',
          properties: {},
          children: [{ type: 'text', value: '見出し1' }],
        },
        {
          type: 'element',
          tagName: 'h3',
          properties: {},
          children: [{ type: 'text', value: '見出し2' }],
        },
        {
          type: 'element',
          tagName: 'h2',
          properties: {},
          children: [{ type: 'text', value: '見出し3' }],
        },
      ],
    }

    const plugin = rehypeHeadingId()
    plugin(tree)

    expect((tree.children[0] as Element).properties?.id).toBe('heading-0')
    expect((tree.children[1] as Element).properties?.id).toBe('heading-1')
    expect((tree.children[2] as Element).properties?.id).toBe('heading-2')
  })

  it('should not add id to h1 headings', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h1',
          properties: {},
          children: [{ type: 'text', value: 'タイトル' }],
        },
      ],
    }

    const plugin = rehypeHeadingId()
    plugin(tree)

    const h1 = tree.children[0] as Element
    expect(h1.properties?.id).toBeUndefined()
  })
})
