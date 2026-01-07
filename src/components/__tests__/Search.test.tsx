import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../Search';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Search', () => {
  it('検索ボタンをクリックすると検索モーダルが開く', () => {
    render(<Search />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(screen.getByPlaceholderText(/検索/i)).toBeInTheDocument();
  });

  it('ESCキーで検索モーダルが閉じる', () => {
    render(<Search />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/検索/i);
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByPlaceholderText(/検索/i)).not.toBeInTheDocument();
  });

  it('検索入力欄に文字を入力できる', () => {
    render(<Search />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/検索/i);
    fireEvent.change(input, { target: { value: 'テスト' } });

    expect(input).toHaveValue('テスト');
  });

  it('検索結果が0件の場合、適切なメッセージが表示される', async () => {
    render(<Search />);

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    const input = screen.getByPlaceholderText(/検索/i);
    fireEvent.change(input, { target: { value: 'xxxxxxxxxxxxxxx' } });

    // 検索結果0件のメッセージを確認（非同期のため待機）
    expect(await screen.findByText(/見つかりませんでした/i)).toBeInTheDocument();
  });
});
