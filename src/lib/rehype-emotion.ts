import { visit } from 'unist-util-visit'
import type { Root, Element, Text, ElementContent } from 'hast'

const EMOTION_LABELS: Record<string, string> = {
  'sadness': '😢',
  'happiness': '😊',
  'anger': '😠',
  'fear': '😨',
  'surprise': '😲',
  'disgust': '🤢',
  'love': '❤️',
  'joy': '😄',
  'anxiety': '😰',
  'hope': '🙏',
}

export default function rehypeEmotion() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'emotion') {
        const emotionType = (node.properties?.type as string) || 'unknown'
        const label = EMOTION_LABELS[emotionType] || emotionType

        // 既存の子要素を保存
        const children = node.children

        // 新しい構造を作成
        node.tagName = 'div'
        node.properties = {
          className: 'emotion-wrapper',
        }

        // 開始タグ
        const openTag: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: 'emotion-tag-open' },
          children: [{ type: 'text', value: `<emotion type="${emotionType}">` }]
        }

        // コンテンツ部分（縦線とラベル付き）
        const contentWrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: 'emotion-content' },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: 'emotion-line-label' },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { className: 'emotion-emoji' },
                  children: [{ type: 'text', value: label }]
                }
              ]
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: 'emotion-text' },
              children: children as ElementContent[]
            }
          ]
        }

        // 閉じタグ
        const closeTag: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: 'emotion-tag-close' },
          children: [{ type: 'text', value: '</emotion>' }]
        }

        node.children = [openTag, contentWrapper, closeTag] as ElementContent[]
      }
    })
  }
}
