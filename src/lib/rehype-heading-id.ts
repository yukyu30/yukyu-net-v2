import type { Root, Element, RootContent } from 'hast'

function visitElement(node: RootContent, headingIndex: { value: number }): void {
  if (node.type === 'element') {
    const element = node as Element
    if (element.tagName === 'h2' || element.tagName === 'h3') {
      element.properties = element.properties || {}
      element.properties.id = `heading-${headingIndex.value}`
      headingIndex.value++
    }
    if (element.children) {
      for (const child of element.children) {
        visitElement(child, headingIndex)
      }
    }
  }
}

export default function rehypeHeadingId() {
  return (tree: Root) => {
    const headingIndex = { value: 0 }
    for (const child of tree.children) {
      visitElement(child, headingIndex)
    }
  }
}
