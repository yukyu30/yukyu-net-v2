import { remark } from 'remark';
import html from 'remark-html';
import { remarkLinkCard } from '../remark-link-card';

describe('remarkLinkCard', () => {
  it('should not transform YouTube URLs (handled by existing embed system)', async () => {
    const markdown = 'https://www.youtube.com/watch?v=test';
    
    const result = await remark()
      .use(remarkLinkCard)
      .use(html, { sanitize: false })
      .process(markdown);

    expect(result.toString()).toContain('https://www.youtube.com/watch?v=test');
  });

  it('should not transform Twitter URLs (handled by existing embed system)', async () => {
    const markdown = 'https://twitter.com/user/status/123456789';
    
    const result = await remark()
      .use(remarkLinkCard)
      .use(html, { sanitize: false })
      .process(markdown);

    expect(result.toString()).toContain('https://twitter.com/user/status/123456789');
  });

  it('should transform regular URLs to simple link cards', async () => {
    const markdown = 'https://example.com/article';
    
    const result = await remark()
      .use(remarkLinkCard)
      .use(html, { sanitize: false })
      .process(markdown);

    const output = result.toString();
    
    expect(output).toContain('link-card-container');
    expect(output).toContain('example.com');
    expect(output).toContain('https://example.com/article');
    expect(output).toContain('target="_blank"');
  });

  it('should not transform non-HTTP URLs', async () => {
    const markdown = 'ftp://example.com/file.txt';
    
    const result = await remark()
      .use(remarkLinkCard)
      .use(html, { sanitize: false })
      .process(markdown);

    expect(result.toString()).toContain('ftp://example.com/file.txt');
    expect(result.toString()).not.toContain('link-card-container');
  });

  it('should handle URL parsing errors gracefully', async () => {
    const markdown = 'https://invalid..url..com';
    
    const result = await remark()
      .use(remarkLinkCard)
      .use(html, { sanitize: false })
      .process(markdown);

    // Should fallback to regular link
    expect(result.toString()).toContain('https://invalid..url..com');
  });
});