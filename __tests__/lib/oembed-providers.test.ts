import { findOEmbedProvider, OEMBED_PROVIDERS } from '@/lib/oembed-providers';

describe('oEmbed Providers', () => {
  describe('Twitter/X URL matching', () => {
    test('Twitter URLを正しく認識する', () => {
      const twitterUrls = [
        'https://twitter.com/yukyu30/status/1368175661874024448',
        'https://www.twitter.com/username/status/123456789',
        'http://twitter.com/user/status/987654321',
      ];

      twitterUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Twitter');
      });
    });

    test('X.com URLを正しく認識する', () => {
      const xUrls = [
        'https://x.com/yukyu30/status/1368175661874024448',
        'https://www.x.com/username/status/123456789',
        'http://x.com/user/status/987654321',
      ];

      xUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Twitter');
      });
    });
  });

  describe('YouTube URL matching', () => {
    test('YouTube watch URLを正しく認識する', () => {
      const youtubeUrls = [
        'https://www.youtube.com/watch?v=xs4AHwFCf_c',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=abc123',
      ];

      youtubeUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('YouTube');
      });
    });

    test('YouTube短縮URLを正しく認識する', () => {
      const shortUrls = [
        'https://youtu.be/xs4AHwFCf_c',
        'http://youtu.be/dQw4w9WgXcQ',
      ];

      shortUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('YouTube');
      });
    });

    test('YouTube埋め込みURLを正しく認識する', () => {
      const embedUrls = [
        'https://www.youtube.com/embed/xs4AHwFCf_c',
        'http://youtube.com/embed/dQw4w9WgXcQ',
      ];

      embedUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('YouTube');
      });
    });
  });

  describe('Instagram URL matching', () => {
    test('Instagram投稿URLを正しく認識する', () => {
      const instagramUrls = [
        'https://www.instagram.com/p/ABC123DEF456/',
        'https://instagram.com/p/XYZ789/',
        'http://www.instagram.com/p/test123/',
      ];

      instagramUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Instagram');
      });
    });

    test('Instagram ReelURLを正しく認識する', () => {
      const reelUrls = [
        'https://www.instagram.com/reel/ABC123DEF456/',
        'https://instagram.com/reel/XYZ789/',
      ];

      reelUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Instagram');
      });
    });
  });

  describe('TikTok URL matching', () => {
    test('TikTok動画URLを正しく認識する', () => {
      const tiktokUrls = [
        'https://www.tiktok.com/@username/video/1234567890123456789',
        'https://tiktok.com/@user.name/video/9876543210987654321',
        'http://www.tiktok.com/@test-user/video/1111111111111111111',
      ];

      tiktokUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('TikTok');
      });
    });

    test('TikTok短縮URLを正しく認識する', () => {
      const shortUrls = [
        'https://vm.tiktok.com/ZMeABC123/',
        'http://vm.tiktok.com/ZMeXYZ789/',
      ];

      shortUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('TikTok');
      });
    });
  });

  describe('Vimeo URL matching', () => {
    test('Vimeo URLを正しく認識する', () => {
      const vimeoUrls = [
        'https://vimeo.com/123456789',
        'https://www.vimeo.com/987654321',
        'http://vimeo.com/111111111',
      ];

      vimeoUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Vimeo');
      });
    });

    test('Vimeo PlayerURLを正しく認識する', () => {
      const playerUrls = [
        'https://player.vimeo.com/video/123456789',
        'http://player.vimeo.com/video/987654321',
      ];

      playerUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('Vimeo');
      });
    });
  });

  describe('SlideShare URL matching', () => {
    test('SlideShare URLを正しく認識する', () => {
      const slideshareUrls = [
        'https://www.slideshare.net/username/presentation-title',
        'https://slideshare.net/user-name/my-slides',
        'http://www.slideshare.net/test/example-presentation',
      ];

      slideshareUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).not.toBeNull();
        expect(provider?.name).toBe('SlideShare');
      });
    });
  });

  describe('サポートされていないURL', () => {
    test('サポートされていないURLはnullを返す', () => {
      const unsupportedUrls = [
        'https://example.com',
        'https://github.com/user/repo',
        'https://www.google.com',
        'https://facebook.com/page',
        'https://linkedin.com/in/profile',
      ];

      unsupportedUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).toBeNull();
      });
    });

    test('無効なURLはnullを返す', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'https://',
        '',
        'ftp://example.com',
      ];

      invalidUrls.forEach(url => {
        const provider = findOEmbedProvider(url);
        expect(provider).toBeNull();
      });
    });
  });

  describe('プロバイダー設定', () => {
    test('全てのプロバイダーが適切な設定を持つ', () => {
      OEMBED_PROVIDERS.forEach(provider => {
        expect(provider.name).toBeTruthy();
        expect(provider.urlPatterns.length).toBeGreaterThan(0);
        expect(provider.endpointUrl).toBeTruthy();
        expect(provider.endpointUrl).toMatch(/^https?:\/\//);
        
        // URLパターンが有効な正規表現であることを確認
        provider.urlPatterns.forEach(pattern => {
          expect(pattern).toBeInstanceOf(RegExp);
        });
      });
    });

    test('プロバイダー名がユニークである', () => {
      const names = OEMBED_PROVIDERS.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });
});