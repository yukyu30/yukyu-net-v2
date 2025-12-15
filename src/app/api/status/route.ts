import { NextResponse } from 'next/server';
import { fetchStatus } from '@/lib/status';

export async function GET() {
  const result = await fetchStatus();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  });
}
