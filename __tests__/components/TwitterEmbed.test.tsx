import { render, screen } from '@testing-library/react';
import TwitterEmbed from '@/components/TwitterEmbed';

// Mock window.twttr
Object.defineProperty(window, 'twttr', {
  value: {
    widgets: {
      load: jest.fn(),
    },
  },
  writable: true,
});

describe('TwitterEmbed', () => {
  const mockTweetId = '1368175661874024448';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Twitter埋め込みコンポーネントが正しくレンダリングされる', () => {
    render(<TwitterEmbed tweetId={mockTweetId} />);
    
    const blockquote = screen.getByRole('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveClass('twitter-tweet');
  });

  test('ツイートIDが正しくリンクに設定される', () => {
    render(<TwitterEmbed tweetId={mockTweetId} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `https://twitter.com/user/status/${mockTweetId}`);
  });

  test('data-dnt属性がデフォルトでtrueに設定される', () => {
    render(<TwitterEmbed tweetId={mockTweetId} />);
    
    const blockquote = screen.getByRole('blockquote');
    expect(blockquote).toHaveAttribute('data-dnt', 'true');
  });

  test('dnt=falseが指定された時にdata-dnt属性がfalseになる', () => {
    render(<TwitterEmbed tweetId={mockTweetId} dnt={false} />);
    
    const blockquote = screen.getByRole('blockquote');
    expect(blockquote).toHaveAttribute('data-dnt', 'false');
  });

  test('align属性が正しく設定される', () => {
    render(<TwitterEmbed tweetId={mockTweetId} align="left" />);
    
    const blockquote = screen.getByRole('blockquote');
    expect(blockquote).toHaveAttribute('data-align', 'left');
  });

  test('center alignの時にflex justify-centerクラスが適用される', () => {
    render(<TwitterEmbed tweetId={mockTweetId} align="center" />);
    
    const container = screen.getByRole('blockquote').parentElement;
    expect(container).toHaveClass('flex', 'justify-center');
  });
});