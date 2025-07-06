import { visit } from 'unist-util-visit';
import { Node } from 'unist';

interface HtmlNode extends Node {
  type: 'html';
  value: string;
}

// Twitter埋め込みの正規表現
const TWITTER_BLOCKQUOTE_REGEX = /<blockquote class="twitter-tweet"[\s\S]*?<\/blockquote>\s*<script[^>]*src="https:\/\/platform\.twitter\.com\/widgets\.js"[^>]*><\/script>/gi;

// YouTube埋め込みの正規表現（iframe形式）
const YOUTUBE_IFRAME_REGEX = /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)(?:\?[^"]*)?\"[^>]*><\/iframe>/gi;

// SlideDeck埋め込みの正規表現
const SLIDEDECK_IFRAME_REGEX = /<iframe[^>]*src="https:\/\/www\.slideshare\.net\/slideshow\/embed_code\/key\/([^"]*)"[^>]*><\/iframe>/gi;

function extractTweetId(blockquoteHtml: string): string | null {
  // Twitter URLからツイートIDを抽出
  const tweetUrlMatch = blockquoteHtml.match(/https:\/\/twitter\.com\/[^\/]+\/status\/(\d+)/);
  if (tweetUrlMatch) {
    return tweetUrlMatch[1];
  }
  
  // href属性からツイートIDを抽出
  const hrefMatch = blockquoteHtml.match(/href="[^"]*\/status\/(\d+)/);
  return hrefMatch ? hrefMatch[1] : null;
}

function extractTwitterAttributes(blockquoteHtml: string): { dnt?: boolean; align?: string } {
  const attributes: { dnt?: boolean; align?: string } = {};
  
  const dntMatch = blockquoteHtml.match(/data-dnt="([^"]*)"/);
  if (dntMatch) {
    attributes.dnt = dntMatch[1] === 'true';
  }
  
  const alignMatch = blockquoteHtml.match(/data-align="([^"]*)"/);
  if (alignMatch) {
    attributes.align = alignMatch[1];
  }
  
  return attributes;
}

export function remarkEmbeds() {
  return (tree: Node) => {
    visit(tree, 'html', (node: HtmlNode) => {
      let { value } = node;
      
      // Twitter埋め込み処理
      value = value.replace(TWITTER_BLOCKQUOTE_REGEX, (match) => {
        const tweetId = extractTweetId(match);
        if (!tweetId) return match;
        
        const attributes = extractTwitterAttributes(match);
        const propsString = Object.entries(attributes)
          .map(([key, val]) => `${key}={${typeof val === 'string' ? `"${val}"` : val}}`)
          .join(' ');
        
        return `<TwitterEmbed tweetId="${tweetId}" ${propsString} />`;
      });
      
      // YouTube埋め込み処理
      value = value.replace(YOUTUBE_IFRAME_REGEX, (match, videoId) => {
        // iframeの属性を抽出
        const titleMatch = match.match(/title="([^"]*)"/);
        const widthMatch = match.match(/width="?(\d+)"?/);
        const heightMatch = match.match(/height="?(\d+)"?/);
        
        const props = [];
        if (titleMatch) props.push(`title="${titleMatch[1]}"`);
        if (widthMatch) props.push(`width={${widthMatch[1]}}`);
        if (heightMatch) props.push(`height={${heightMatch[1]}}`);
        
        return `<YouTubeEmbed videoId="${videoId}" ${props.join(' ')} />`;
      });
      
      // SlideDeck埋め込み処理
      value = value.replace(SLIDEDECK_IFRAME_REGEX, (match, slideId) => {
        const titleMatch = match.match(/title="([^"]*)"/);
        const widthMatch = match.match(/width="?(\d+)"?/);
        const heightMatch = match.match(/height="?(\d+)"?/);
        
        const props = [];
        if (titleMatch) props.push(`title="${titleMatch[1]}"`);
        if (widthMatch) props.push(`width={${widthMatch[1]}}`);
        if (heightMatch) props.push(`height={${heightMatch[1]}}`);
        
        return `<SlideDeckEmbed slideId="${slideId}" ${props.join(' ')} />`;
      });
      
      node.value = value;
    });
  };
}