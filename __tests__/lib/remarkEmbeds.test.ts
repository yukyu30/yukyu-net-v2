import { remark } from 'remark';
import html from 'remark-html';
import { remarkEmbeds } from '@/lib/remarkEmbeds';

describe('remarkEmbeds', () => {
  test('Twitter埋め込みHTMLをコンポーネントに変換する', async () => {
    const input = `
# Test Post

<blockquote class="twitter-tweet" data-dnt="true" data-align="center">
  <p lang="ja" dir="ltr">mi watch 一部背景カスタマイズできる！！ 
  <a href="https://t.co/BZF3fE1iyd">pic.twitter.com/BZF3fE1iyd</a></p>
  &mdash; yukyu (a.k.a ugo) (@yukyu30) 
  <a href="https://twitter.com/yukyu30/status/1368175661874024448?ref_src=twsrc%5Etfw">March 6, 2021</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Some other content.
    `;

    const result = await remark()
      .use(remarkEmbeds)
      .use(html)
      .process(input);

    const output = result.toString();
    
    expect(output).toContain('<TwitterEmbed tweetId="1368175661874024448"');
    expect(output).toContain('dnt={true}');
    expect(output).toContain('align="center"');
    expect(output).not.toContain('<blockquote class="twitter-tweet"');
    expect(output).not.toContain('<script async src="https://platform.twitter.com/widgets.js"');
  });

  test('YouTube埋め込みHTMLをコンポーネントに変換する', async () => {
    const input = `
# Test Post

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" frameborder="0" allowfullscreen></iframe>

Some other content.
    `;

    const result = await remark()
      .use(remarkEmbeds)
      .use(html)
      .process(input);

    const output = result.toString();
    
    expect(output).toContain('<YouTubeEmbed videoId="dQw4w9WgXcQ"');
    expect(output).toContain('title="Rick Astley - Never Gonna Give You Up"');
    expect(output).toContain('width={560}');
    expect(output).toContain('height={315}');
    expect(output).not.toContain('<iframe');
    expect(output).not.toContain('youtube.com/embed');
  });

  test('SlideDeck埋め込みHTMLをコンポーネントに変換する', async () => {
    const input = `
# Test Post

<iframe src="https://www.slideshare.net/slideshow/embed_code/key/abc123def456" width="560" height="420" title="My Presentation" frameborder="0" allowfullscreen></iframe>

Some other content.
    `;

    const result = await remark()
      .use(remarkEmbeds)
      .use(html)
      .process(input);

    const output = result.toString();
    
    expect(output).toContain('<SlideDeckEmbed slideId="abc123def456"');
    expect(output).toContain('title="My Presentation"');
    expect(output).toContain('width={560}');
    expect(output).toContain('height={420}');
    expect(output).not.toContain('slideshare.net/slideshow/embed_code');
  });

  test('複数の埋め込みが混在している場合も正しく変換する', async () => {
    const input = `
# Test Post

<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/123456">Tweet</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js"></script>

<iframe src="https://www.youtube.com/embed/abc123" width="560" height="315"></iframe>

<iframe src="https://www.slideshare.net/slideshow/embed_code/key/def456" width="560" height="420"></iframe>
    `;

    const result = await remark()
      .use(remarkEmbeds)
      .use(html)
      .process(input);

    const output = result.toString();
    
    expect(output).toContain('<TwitterEmbed tweetId="123456"');
    expect(output).toContain('<YouTubeEmbed videoId="abc123"');
    expect(output).toContain('<SlideDeckEmbed slideId="def456"');
  });

  test('埋め込み以外のHTMLは変更されない', async () => {
    const input = `
# Test Post

<div class="custom-content">
  <p>This is regular HTML content.</p>
  <iframe src="https://example.com/embed" width="400" height="300"></iframe>
</div>
    `;

    const result = await remark()
      .use(remarkEmbeds)
      .use(html)
      .process(input);

    const output = result.toString();
    
    expect(output).toContain('<div class="custom-content">');
    expect(output).toContain('<iframe src="https://example.com/embed"');
    expect(output).not.toContain('TwitterEmbed');
    expect(output).not.toContain('YouTubeEmbed');
    expect(output).not.toContain('SlideDeckEmbed');
  });
});