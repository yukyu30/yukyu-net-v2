import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import TwitterEmbed from './TwitterEmbed';
import YouTubeEmbed from './YouTubeEmbed';
import SlideDeckEmbed from './SlideDeckEmbed';

const componentMap = {
  TwitterEmbed,
  YouTubeEmbed,
  SlideDeckEmbed,
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && componentMap[domNode.name as keyof typeof componentMap]) {
      const props: Record<string, string | number | boolean> = {};
      
      // 属性をpropsに変換
      if (domNode.attribs) {
        Object.entries(domNode.attribs).forEach(([key, value]) => {
          // 数値属性の処理
          if (['width', 'height'].includes(key)) {
            props[key] = parseInt(value, 10);
          }
          // ブール属性の処理
          else if (key === 'dnt') {
            props[key] = value === 'true';
          }
          // 文字列属性
          else {
            props[key] = value;
          }
        });
      }
      
      // 各コンポーネントの必須propsを確認
      if (domNode.name === 'TwitterEmbed' && props.tweetId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <TwitterEmbed {...(props as any)} />;
      } else if (domNode.name === 'YouTubeEmbed' && props.videoId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <YouTubeEmbed {...(props as any)} />;
      } else if (domNode.name === 'SlideDeckEmbed' && props.slideId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <SlideDeckEmbed {...(props as any)} />;
      }
    }
  },
};

interface HtmlParserProps {
  html: string;
}

export default function HtmlParser({ html }: HtmlParserProps) {
  return <>{parse(html, options)}</>;
}