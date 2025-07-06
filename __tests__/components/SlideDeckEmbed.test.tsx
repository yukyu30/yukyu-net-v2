import { render, screen } from '@testing-library/react';
import SlideDeckEmbed from '@/components/SlideDeckEmbed';

describe('SlideDeckEmbed', () => {
  const mockSlideId = 'abc123def456';

  test('SlideDeck埋め込みコンポーネントが正しくレンダリングされる', () => {
    render(<SlideDeckEmbed slideId={mockSlideId} />);
    
    const iframe = screen.getByTitle('SlideDeck presentation');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', `https://www.slideshare.net/slideshow/embed_code/key/${mockSlideId}`);
  });

  test('デフォルトの幅と高さが設定される', () => {
    render(<SlideDeckEmbed slideId={mockSlideId} />);
    
    const iframe = screen.getByTitle('SlideDeck presentation');
    expect(iframe).toHaveAttribute('width', '560');
    expect(iframe).toHaveAttribute('height', '420');
  });

  test('カスタムの幅と高さが設定される', () => {
    render(<SlideDeckEmbed slideId={mockSlideId} width={800} height={600} />);
    
    const iframe = screen.getByTitle('SlideDeck presentation');
    expect(iframe).toHaveAttribute('width', '800');
    expect(iframe).toHaveAttribute('height', '600');
  });

  test('カスタムタイトルが設定される', () => {
    const customTitle = 'My Presentation';
    render(<SlideDeckEmbed slideId={mockSlideId} title={customTitle} />);
    
    const iframe = screen.getByTitle(customTitle);
    expect(iframe).toBeInTheDocument();
  });

  test('必要な属性が設定される', () => {
    render(<SlideDeckEmbed slideId={mockSlideId} />);
    
    const iframe = screen.getByTitle('SlideDeck presentation');
    expect(iframe).toHaveAttribute('frameBorder', '0');
    expect(iframe).toHaveAttribute('marginWidth', '0');
    expect(iframe).toHaveAttribute('marginHeight', '0');
    expect(iframe).toHaveAttribute('scrolling', 'no');
    expect(iframe).toHaveAttribute('allowFullScreen');
  });

  test('適切なCSSクラスが適用される', () => {
    render(<SlideDeckEmbed slideId={mockSlideId} />);
    
    const iframe = screen.getByTitle('SlideDeck presentation');
    expect(iframe).toHaveClass('rounded-lg', 'shadow-lg', 'max-w-full');
  });
});