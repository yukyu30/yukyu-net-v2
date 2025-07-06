// YouTube埋め込み用のトランスフォーマー
const getYouTubeHTML = (url: string) => {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return null;
  }

  const html = `
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5rem 0;">
      <iframe 
        src="https://www.youtube.com/embed/${videoId}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="YouTube video player"
      ></iframe>
    </div>
  `.trim();
  
  return html;
};

// Twitter/X埋め込み用のトランスフォーマー
const getTwitterHTML = (url: string) => {
  return `
    <blockquote class="twitter-tweet" data-dnt="true">
      <a href="${url}">View this Tweet</a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  `.trim();
};

// Vimeo埋め込み用のトランスフォーマー
const getVimeoHTML = (url: string) => {
  const videoId = extractVimeoVideoId(url);
  if (!videoId) return null;

  return `
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 1.5rem 0;">
      <iframe 
        src="https://player.vimeo.com/video/${videoId}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        title="Vimeo video player"
      ></iframe>
    </div>
  `.trim();
};

// YouTube Video IDを抽出
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Vimeo Video IDを抽出
function extractVimeoVideoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(?:.*\/)?(\d+)/i,
    /player\.vimeo\.com\/video\/(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// remark-embedder設定
export const remarkEmbedderConfig = {
  transformers: [
    // YouTube
    {
      name: 'YouTube',
      shouldTransform: (url: string) => {
        return /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[\w-]+/i.test(url);
      },
      getHTML: (url: string) => getYouTubeHTML(url),
    },
    
    // Twitter/X
    {
      name: 'Twitter',
      shouldTransform: (url: string) => {
        return /(?:twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i.test(url);
      },
      getHTML: (url: string) => getTwitterHTML(url),
    },
    
    // Vimeo
    {
      name: 'Vimeo',
      shouldTransform: (url: string) => {
        return /(?:vimeo\.com\/(?:.*\/)?|player\.vimeo\.com\/video\/)\d+/i.test(url);
      },
      getHTML: (url: string) => getVimeoHTML(url),
    },
  ],
};