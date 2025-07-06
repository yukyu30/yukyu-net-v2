import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Paragraph, Text } from 'mdast';

// URL カードに変換すべきURLかどうかを判定
function shouldTransformToCard(url: string): boolean {
  // 既存の埋め込みシステムが処理するURLは除外
  const embedPatterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/i,
    /(?:twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
    /(?:vimeo\.com\/(?:.*\/)?|player\.vimeo\.com\/video\/)\d+/i,
  ];

  return !embedPatterns.some(pattern => pattern.test(url));
}

// URLがHTTP(S)かどうかを判定
function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const remarkLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // 段落が単一のテキストノードで、それがURLの場合
      if (
        node.children.length === 1 &&
        node.children[0].type === 'text'
      ) {
        const textNode = node.children[0] as Text;
        const text = textNode.value.trim();

        if (isValidHttpUrl(text) && shouldTransformToCard(text)) {
          // シンプルなリンクカードHTML生成
          const html = generateSimpleLinkHTML(text);
          if (html && parent && typeof index === 'number') {
            const cardNode = {
              type: 'html' as const,
              value: html,
            };
            parent.children[index] = cardNode;
          }
        }
      }
    });
  };
};

function generateSimpleLinkHTML(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `
      <div class="link-card-container my-3">
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="!text-inherit !no-underline !border-b-gray-200 !border flex items-center p-3 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 block">
          <div class="w-10 h-10 bg-gray-100 rounded mr-3 flex-shrink-0 flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 truncate">${escapeHtml(hostname)}</div>
            <div class="text-xs text-gray-500 truncate">${escapeHtml(url)}</div>
          </div>
        </a>
      </div>
    `.trim();
  } catch (error) {
    console.error('Failed to generate simple link card for:', url, error);
    return `<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></p>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
