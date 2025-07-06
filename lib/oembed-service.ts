import { findOEmbedProvider, OEmbedResponse } from './oembed-providers';

export class OEmbedService {
  private cache = new Map<string, OEmbedResponse>();
  private readonly timeout = 10000; // 10秒タイムアウト

  async fetchOEmbed(url: string): Promise<OEmbedResponse | null> {
    // キャッシュから取得を試行
    const cached = this.cache.get(url);
    if (cached) {
      return cached;
    }

    const provider = findOEmbedProvider(url);
    if (!provider) {
      console.warn(`No oEmbed provider found for URL: ${url}`);
      return null;
    }

    try {
      // oEmbed API エンドポイントのURL構築
      const embedUrl = new URL(provider.endpointUrl);
      embedUrl.searchParams.set('url', url);
      embedUrl.searchParams.set('format', 'json');
      
      if (provider.maxWidth) {
        embedUrl.searchParams.set('maxwidth', provider.maxWidth.toString());
      }
      if (provider.maxHeight) {
        embedUrl.searchParams.set('maxheight', provider.maxHeight.toString());
      }

      // 特定プロバイダーの追加パラメータ
      if (provider.name === 'Twitter') {
        embedUrl.searchParams.set('dnt', 'true');
        embedUrl.searchParams.set('omit_script', 'true');
      }

      // fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(embedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'yukyu-blog/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: OEmbedResponse = await response.json();
      
      // キャッシュに保存
      this.cache.set(url, data);
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch oEmbed for ${url}:`, error);
      return null;
    }
  }

  // ビルド時にoEmbedデータを取得してキャッシュファイルに保存
  async prebuildOEmbedCache(urls: string[]): Promise<Record<string, OEmbedResponse>> {
    const cache: Record<string, OEmbedResponse> = {};
    
    console.log(`Fetching oEmbed data for ${urls.length} URLs...`);
    
    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const data = await this.fetchOEmbed(url);
        if (data) {
          cache[url] = data;
        }
        return { url, data };
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Successfully fetched ${successful}/${urls.length} oEmbed responses`);

    return cache;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const oembedService = new OEmbedService();