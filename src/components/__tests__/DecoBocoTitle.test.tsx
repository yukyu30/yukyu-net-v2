import { render } from '@testing-library/react';
import DecoBocoTitle from '../DecoBocoTitle';
import { useEffect } from 'react';

// GSAPをモック
const mockTo = jest.fn();
jest.mock('gsap', () => ({
  to: (...args: unknown[]) => mockTo(...args),
  registerPlugin: jest.fn(),
}));

// useGSAPをuseEffectでシミュレート
jest.mock('@gsap/react', () => ({
  useGSAP: (callback: () => void, deps: { scope: React.RefObject<HTMLElement | null> }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // コンポーネントがマウントされた後にコールバックを実行
      callback();
    }, [deps.scope]);
  },
}));

beforeEach(() => {
  mockTo.mockClear();
});

describe('DecoBocoTitle', () => {
  /**
   * テストリスト:
   * 1. [x] コンポーネントが正しくレンダリングされる
   * 2. [ ] 各文字が個別のspan要素として表示される
   * 3. [ ] アニメーション用の属性が適用されている
   * 4. [ ] GSAPアニメーションが初期化される
   */

  it('コンポーネントが正しくレンダリングされる', () => {
    const { container } = render(<DecoBocoTitle text="DecoBoco Digital" />);

    expect(container.textContent).toBe('DecoBoco Digital');
  });

  it('各文字が個別のspan要素として表示される', () => {
    const { container } = render(<DecoBocoTitle text="ABC" />);

    const charSpans = container.querySelectorAll('[data-char]');
    expect(charSpans).toHaveLength(3);
    expect(charSpans[0]).toHaveTextContent('A');
    expect(charSpans[1]).toHaveTextContent('B');
    expect(charSpans[2]).toHaveTextContent('C');
  });

  it('GSAPアニメーションが初期化される', () => {
    render(<DecoBocoTitle text="ABC" />);

    // gsap.toが呼び出されていることを確認
    expect(mockTo).toHaveBeenCalled();

    // アニメーション設定にscaleYが含まれていることを確認（凸凹エフェクト用）
    const callArgs = mockTo.mock.calls[0];
    expect(callArgs[1]).toHaveProperty('scaleY');
  });
});
