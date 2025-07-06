export interface OEmbedProvider {
  name: string;
  urlPatterns: RegExp[];
  endpointUrl: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const OEMBED_PROVIDERS: OEmbedProvider[] = [
  // Twitter/X
  {
    name: 'Twitter',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?twitter\.com\/[^\/]+\/status\/\d+/i,
      /^https?:\/\/(?:www\.)?x\.com\/[^\/]+\/status\/\d+/i,
    ],
    endpointUrl: 'https://publish.twitter.com/oembed',
    maxWidth: 500,
  },
  
  // YouTube
  {
    name: 'YouTube',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/i,
      /^https?:\/\/youtu\.be\/[\w-]+/i,
      /^https?:\/\/(?:www\.)?youtube\.com\/embed\/[\w-]+/i,
    ],
    endpointUrl: 'https://www.youtube.com/oembed',
    maxWidth: 560,
    maxHeight: 315,
  },
  
  // Vimeo
  {
    name: 'Vimeo',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?vimeo\.com\/\d+/i,
      /^https?:\/\/player\.vimeo\.com\/video\/\d+/i,
    ],
    endpointUrl: 'https://vimeo.com/api/oembed.json',
    maxWidth: 560,
    maxHeight: 315,
  },
  
  // Instagram
  {
    name: 'Instagram',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?instagram\.com\/p\/[\w-]+/i,
      /^https?:\/\/(?:www\.)?instagram\.com\/reel\/[\w-]+/i,
    ],
    endpointUrl: 'https://graph.facebook.com/v8.0/instagram_oembed',
    maxWidth: 400,
  },
  
  // TikTok
  {
    name: 'TikTok',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/i,
      /^https?:\/\/vm\.tiktok\.com\/[\w]+/i,
    ],
    endpointUrl: 'https://www.tiktok.com/oembed',
    maxWidth: 325,
  },
  
  // SlideShare
  {
    name: 'SlideShare',
    urlPatterns: [
      /^https?:\/\/(?:www\.)?slideshare\.net\/[\w-]+\/[\w-]+/i,
    ],
    endpointUrl: 'https://www.slideshare.net/api/oembed/2',
    maxWidth: 560,
    maxHeight: 420,
  },
];

export function findOEmbedProvider(url: string): OEmbedProvider | null {
  for (const provider of OEMBED_PROVIDERS) {
    for (const pattern of provider.urlPatterns) {
      if (pattern.test(url)) {
        return provider;
      }
    }
  }
  return null;
}

export interface OEmbedResponse {
  type: 'video' | 'photo' | 'link' | 'rich';
  version: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: number;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  
  // video/rich specific
  html?: string;
  width?: number;
  height?: number;
  
  // photo specific
  url?: string;
}