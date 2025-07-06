import { NextRequest, NextResponse } from 'next/server';
import { oembedService } from '@/lib/oembed-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // URL形式をチェック
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const embedData = await oembedService.fetchOEmbed(url);

    if (!embedData) {
      return NextResponse.json(
        { error: 'No oEmbed data found for this URL' },
        { status: 404 }
      );
    }

    // CORSヘッダーとキャッシュ設定
    const response = NextResponse.json(embedData);
    
    // 1時間キャッシュ
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    // CORS設定（必要に応じて）
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('oEmbed API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONSリクエスト用（CORS preflight）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
