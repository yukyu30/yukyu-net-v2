import type { Heading } from '@/lib/extract-headings'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="toc border border-green-800 p-4 mb-8">
      <div className="text-sm font-mono text-green-600 uppercase mb-3">
        {'>'} INDEX
      </div>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className="text-sm font-mono text-green-400 hover:text-green-300 hover:underline transition-colors"
            >
              {heading.level === 2 ? '>' : '-'} {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
