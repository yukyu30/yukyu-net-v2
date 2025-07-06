'use client';

import { useEffect } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
  align?: 'left' | 'center' | 'right';
  dnt?: boolean;
}

export default function TwitterEmbed({ tweetId, align = 'center', dnt = true }: TwitterEmbedProps) {
  useEffect(() => {
    // Load Twitter widgets script if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.head.appendChild(script);
    } else {
      // If script is already loaded, load the widgets
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className={`twitter-embed ${align === 'center' ? 'flex justify-center' : ''}`}>
      <blockquote 
        className="twitter-tweet" 
        data-dnt={dnt ? 'true' : 'false'}
        data-align={align}
      >
        <a href={`https://twitter.com/user/status/${tweetId}`}>
          Loading tweet...
        </a>
      </blockquote>
    </div>
  );
}

// Extend Window interface to include twttr
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
      };
    };
  }
}