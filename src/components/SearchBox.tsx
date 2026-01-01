'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false)
      setQuery('')
    }
  }

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  return (
    <div className="relative">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 border-l border-green-400 hover:bg-green-400 hover:text-black transition-colors flex items-center justify-center"
          aria-label="Search"
        >
          <span className="text-xs font-mono font-bold">SEARCH</span>
        </button>
      ) : (
        <form onSubmit={handleSearch} className="flex border-l border-green-400">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="検索..."
            className="px-4 py-2 bg-transparent text-xs font-mono outline-none w-48 border-none"
            aria-label="Search input"
          />
          <button
            type="submit"
            className="px-4 py-2 hover:bg-green-400 hover:text-black transition-colors"
            aria-label="Submit search"
          >
            <span className="text-xs font-mono font-bold">→</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false)
              setQuery('')
            }}
            className="px-4 py-2 border-l border-green-400 hover:bg-red-400 hover:text-black transition-colors"
            aria-label="Close search"
          >
            <span className="text-xs font-mono font-bold">✕</span>
          </button>
        </form>
      )}
    </div>
  )
}
