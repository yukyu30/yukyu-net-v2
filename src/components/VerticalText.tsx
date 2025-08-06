'use client'

interface VerticalTextProps {
  texts: string[]
  position: 'left' | 'right'
  className?: string
}

export default function VerticalText({ texts, position, className = '' }: VerticalTextProps) {
  const year = new Date().getFullYear()
  
  const displayTexts = position === 'right' 
    ? texts.map(text => text === 'YEAR' ? `${year} ARCHIVE` : text)
    : texts

  const writingMode = position === 'left' 
    ? { writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)' }
    : { writingMode: 'vertical-lr' as const }

  return (
    <div className={`hidden md:block absolute ${position === 'left' ? '-left-12' : '-right-12'} top-8 ${className}`}>
      <div className="border border-black bg-white">
        {displayTexts.map((text, index) => (
          <div key={index} className={`px-1 py-2 ${index > 0 ? 'border-t border-black' : ''}`}>
            <div
              className="text-xs font-mono tracking-wider"
              style={writingMode}
            >
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}