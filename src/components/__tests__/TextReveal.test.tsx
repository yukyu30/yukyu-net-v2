import { render, act } from '@testing-library/react';
import TextReveal from '../TextReveal';

// タイマーをモック
jest.useFakeTimers();

describe('TextReveal', () => {
  /**
   * テストリスト:
   * 1. [x] コンポーネントが正しくレンダリングされる
   * 2. [ ] 初期状態では文字化けした文字が表示される
   * 3. [ ] 時間経過で正しい文字に変わる
   */

  it('コンポーネントが正しくレンダリングされる', () => {
    const { container } = render(<TextReveal text="Hello" />);

    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('初期状態では文字化けした文字が表示される', () => {
    const { container } = render(<TextReveal text="ABC" />);

    // 初期状態では元のテキストと異なる（文字化け）
    const textContent = container.textContent;
    expect(textContent).not.toBe('ABC');
    expect(textContent?.length).toBe(3);
  });

  it('時間経過で正しい文字に変わる', () => {
    const { container } = render(<TextReveal text="Hi" duration={1000} />);

    // アニメーション完了後
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(container.textContent).toBe('Hi');
  });
});
