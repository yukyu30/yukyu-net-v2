import { render, screen } from '@testing-library/react';
import YouTubeEmbed from '@/components/YouTubeEmbed';

describe('YouTubeEmbed', () => {
  const mockVideoId = 'dQw4w9WgXcQ';

  test('YouTube埋め込みコンポーネントが正しくレンダリングされる', () => {
    render(<YouTubeEmbed videoId={mockVideoId} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', `https://www.youtube.com/embed/${mockVideoId}`);
  });

  test('デフォルトの幅と高さが設定される', () => {
    render(<YouTubeEmbed videoId={mockVideoId} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('width', '560');
    expect(iframe).toHaveAttribute('height', '315');
  });

  test('カスタムの幅と高さが設定される', () => {
    render(<YouTubeEmbed videoId={mockVideoId} width={800} height={450} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('width', '800');
    expect(iframe).toHaveAttribute('height', '450');
  });

  test('カスタムタイトルが設定される', () => {
    const customTitle = 'Custom Video Title';
    render(<YouTubeEmbed videoId={mockVideoId} title={customTitle} />);
    
    const iframe = screen.getByTitle(customTitle);
    expect(iframe).toBeInTheDocument();
  });

  test('必要な属性が設定される', () => {
    render(<YouTubeEmbed videoId={mockVideoId} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('frameBorder', '0');
    expect(iframe).toHaveAttribute('allowFullScreen');
    expect(iframe).toHaveAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  });

  test('適切なCSSクラスが適用される', () => {
    render(<YouTubeEmbed videoId={mockVideoId} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveClass('rounded-lg', 'shadow-lg', 'max-w-full');
  });
});