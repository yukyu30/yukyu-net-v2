'use client'

import { useEffect, useState } from 'react'

interface ShareButtonsProps {
  title: string
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const shareOnX = () => {
    const text = encodeURIComponent(title)
    const url = encodeURIComponent(currentUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      alert('URLをコピーしました')
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <div className="border-t-2 border-black">
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-mono">Share this post</h3>
          <div className="flex gap-4">
            <button
              onClick={shareOnX}
              className="p-3 border border-black bg-white hover:bg-black hover:text-white transition-colors"
              aria-label="Share on X"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={copyToClipboard}
              className="p-3 border border-black bg-white hover:bg-black hover:text-white transition-colors"
              aria-label="Copy link"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}