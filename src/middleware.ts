import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // タグページへのアクセスをハンドリング
  if (pathname.startsWith('/tags/')) {
    const tagPath = pathname.slice(6) // '/tags/' を除去
    
    // 既にエンコードされている場合はそのまま通す
    if (tagPath.includes('%')) {
      return NextResponse.next()
    }
    
    // 日本語タグの場合はエンコードしてリダイレクト
    const encodedTag = encodeURIComponent(tagPath)
    if (encodedTag !== tagPath) {
      return NextResponse.redirect(new URL(`/tags/${encodedTag}`, request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/tags/:path*',
}