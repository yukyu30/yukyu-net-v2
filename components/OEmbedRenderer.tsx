'use client';

import { useEffect, useState } from 'react';
import { OEmbedResponse } from '@/lib/oembed-providers';

interface OEmbedRendererProps {
  url: string;
  className?: string;
}

export default function OEmbedRenderer({ url, className = '' }: OEmbedRendererProps) {
  const [embedData, setEmbedData] = useState<OEmbedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbed = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch embed: ${response.statusText}`);
        }
        
        const data: OEmbedResponse = await response.json();
        setEmbedData(data);
      } catch (err) {
        console.error('Failed to fetch oEmbed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbed();
  }, [url]);

  if (loading) {
    return (
      <div className={`oembed-loading p-4 border rounded-lg bg-gray-50 ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Loading embed...</p>
      </div>
    );
  }

  if (error || !embedData) {
    return (
      <div className={`oembed-error p-4 border border-red-200 rounded-lg bg-red-50 ${className}`}>
        <p className="text-red-700">
          Failed to load embed for: 
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-blue-600 hover:underline"
          >
            {url}
          </a>
        </p>
        {error && (
          <p className="text-sm text-red-600 mt-1">Error: {error}</p>
        )}
      </div>
    );
  }

  // リッチコンテンツまたは動画の場合
  if ((embedData.type === 'rich' || embedData.type === 'video') && embedData.html) {
    return (
      <div className={`oembed-container ${className}`}>
        <div 
          className="oembed-content"
          dangerouslySetInnerHTML={{ __html: embedData.html }}
        />
        {embedData.provider_name && (
          <p className="text-xs text-gray-500 mt-2">
            via {embedData.provider_name}
          </p>
        )}
      </div>
    );
  }

  // 画像の場合
  if (embedData.type === 'photo' && embedData.url) {
    return (
      <div className={`oembed-photo ${className}`}>
        <img
          src={embedData.url}
          alt={embedData.title || 'Embedded image'}
          width={embedData.width}
          height={embedData.height}
          className="max-w-full h-auto rounded-lg"
        />
        {(embedData.title || embedData.provider_name) && (
          <div className="mt-2">
            {embedData.title && (
              <p className="font-medium">{embedData.title}</p>
            )}
            {embedData.provider_name && (
              <p className="text-xs text-gray-500">via {embedData.provider_name}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // リンクの場合
  if (embedData.type === 'link') {
    return (
      <div className={`oembed-link p-4 border rounded-lg ${className}`}>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
        >
          {embedData.thumbnail_url && (
            <img
              src={embedData.thumbnail_url}
              alt=""
              width={embedData.thumbnail_width}
              height={embedData.thumbnail_height}
              className="w-full h-32 object-cover rounded mb-3"
            />
          )}
          {embedData.title && (
            <h3 className="font-medium text-lg text-blue-600 hover:underline">
              {embedData.title}
            </h3>
          )}
          {embedData.author_name && (
            <p className="text-gray-600 text-sm mt-1">by {embedData.author_name}</p>
          )}
          {embedData.provider_name && (
            <p className="text-xs text-gray-500 mt-2">via {embedData.provider_name}</p>
          )}
        </a>
      </div>
    );
  }

  // フォールバック
  return (
    <div className={`oembed-fallback p-4 border rounded-lg ${className}`}>
      <p>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {embedData.title || url}
        </a>
      </p>
      {embedData.provider_name && (
        <p className="text-xs text-gray-500 mt-1">via {embedData.provider_name}</p>
      )}
    </div>
  );
}