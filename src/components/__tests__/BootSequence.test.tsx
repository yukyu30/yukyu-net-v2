import { render, screen, act } from '@testing-library/react';
import BootSequence from '../BootSequence';

jest.useFakeTimers();

describe('BootSequence', () => {
  /**
   * テストリスト:
   * 1. [x] 起動画面が表示される
   * 2. [ ] 起動シーケンスのテキストが順番に表示される
   * 3. [ ] 完了後にchildrenが表示される
   */

  it('起動画面が表示される', () => {
    render(
      <BootSequence>
        <div>メインコンテンツ</div>
      </BootSequence>
    );

    expect(screen.getByText('DecoBocoDigital OS')).toBeInTheDocument();
  });

  it('完了後にchildrenが表示される', () => {
    render(
      <BootSequence>
        <div>メインコンテンツ</div>
      </BootSequence>
    );

    // 起動シーケンス完了まで待つ
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('メインコンテンツ')).toBeInTheDocument();
  });
});
