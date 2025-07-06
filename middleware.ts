import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /public_articles へのリクエストをリライト
  if (request.nextUrl.pathname.startsWith('/public_articles/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/images${request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: '/public_articles/:path*',
};