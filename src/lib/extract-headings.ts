export interface Heading {
  id: string
  text: string
  level: number
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = []
  const regex = /<h([2-3])(?:\s+id="([^"]*)")?[^>]*>([^<]*)<\/h[2-3]>/g

  let match
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2] || '',
      text: match[3].trim(),
    })
  }

  return headings
}
