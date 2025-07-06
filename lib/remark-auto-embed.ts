import { visit } from 'unist-util-visit';
import { Node } from 'unist';

interface TextNode extends Node {
  type: 'text';
  value: string;
}

interface ParagraphNode extends Node {
  type: 'paragraph';
  children: Node[];
}

interface LinkNode extends Node {
  type: 'link';
  url: string;
  children: Node[];
}

interface ParentNode extends Node {
  children: Node[];
}

// URL検出の正規表現
const URL_REGEX = /(https?:\/\/[^\s<>"\[\]{}|\\^`]+)/gi;

// サポートするURLパターン
const SUPPORTED_PATTERNS = [
  // Twitter/X
  /^https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
  // YouTube
  /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/i,
  /^https?:\/\/youtu\.be\/[\w-]+/i,
  // Vimeo
  /^https?:\/\/(?:www\.)?vimeo\.com\/\d+/i,
  // Instagram
  /^https?:\/\/(?:www\.)?instagram\.com\/(p|reel)\/[\w-]+/i,
  // TikTok
  /^https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
  /^https?:\/\/vm\.tiktok\.com\/[\w]+/i,
  // SlideShare
  /^https?:\/\/(?:www\.)?slideshare\.net\/[\w-]+\/[\w-]+/i,
];

function isSupportedUrl(url: string): boolean {
  return SUPPORTED_PATTERNS.some(pattern => pattern.test(url));
}

interface HtmlNode extends Node {
  type: 'html';
  value: string;
}

function createEmbedNode(url: string): HtmlNode {
  return {
    type: 'html',
    value: `<div data-oembed-url="${url}" class="oembed-placeholder">
  <p>Loading embed for: <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>
</div>`,
  };
}

export function remarkAutoEmbed() {
  return (tree: Node) => {
    visit(tree, 'paragraph', (paragraphNode: ParagraphNode, index, parent: ParentNode) => {
      // 段落が単一のテキストノードで、かつそのテキストがサポートされるURLの場合
      if (paragraphNode.children.length === 1) {
        const child = paragraphNode.children[0];
        
        // テキストノードの場合
        if (child.type === 'text') {
          const textNode = child as TextNode;
          const trimmedText = textNode.value.trim();
          
          // テキストがURLでサポートされる場合
          if (isSupportedUrl(trimmedText)) {
            const embedNode = createEmbedNode(trimmedText);
            if (parent && typeof index === 'number') {
              parent.children[index] = embedNode;
            }
            return;
          }
        }
        
        // リンクノードの場合
        if (child.type === 'link') {
          const linkNode = child as LinkNode;
          
          // リンクのテキストがURLと同じ場合（自動リンク）
          if (linkNode.children.length === 1 && linkNode.children[0].type === 'text') {
            const linkText = (linkNode.children[0] as TextNode).value;
            if (linkText === linkNode.url && isSupportedUrl(linkNode.url)) {
              const embedNode = createEmbedNode(linkNode.url);
              if (parent && typeof index === 'number') {
                parent.children[index] = embedNode;
              }
              return;
            }
          }
        }
      }
      
      // 複数の子要素がある段落内でもURLを検出
      let hasChanges = false;
      const newChildren: Node[] = [];
      
      for (const child of paragraphNode.children) {
        if (child.type === 'text') {
          const textNode = child as TextNode;
          const parts = textNode.value.split(URL_REGEX);
          
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            if (i % 2 === 1) { // URLの部分（正規表現のキャプチャグループ）
              if (isSupportedUrl(part)) {
                // URLを埋め込みに変換
                newChildren.push(createEmbedNode(part));
                hasChanges = true;
              } else {
                // サポートされていないURLはそのまま
                newChildren.push({
                  type: 'text',
                  value: part,
                } as TextNode);
              }
            } else {
              // 通常のテキスト部分
              if (part) {
                newChildren.push({
                  type: 'text',
                  value: part,
                } as TextNode);
              }
            }
          }
        } else {
          newChildren.push(child);
        }
      }
      
      if (hasChanges) {
        paragraphNode.children = newChildren;
      }
    });
  };
}