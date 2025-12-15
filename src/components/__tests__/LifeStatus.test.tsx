/**
 * テストリスト:
 * - [x] is_alive が true の場合、「ALIVE」と表示される
 * - [x] is_alive が false の場合、「OFFLINE」と表示される
 * - [x] signal_count が表示される
 * - [x] last_seen_at が相対時間で表示される
 * - [x] ローディング中はローディング表示
 * - [x] エラー時はエラー表示
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LifeStatus } from '../LifeStatus';
import type { StatusResponse } from '@/types/status';

describe('LifeStatus', () => {
  const mockStatus: StatusResponse = {
    is_alive: true,
    last_seen_at: '2025-01-01T12:00:00Z',
    signal_count: 10,
    recent_signals: [],
    human: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'yukyu',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  };

  it('is_alive が true の場合、「ALIVE」と表示される', () => {
    render(<LifeStatus status={mockStatus} isLoading={false} error={null} />);
    expect(screen.getByText('ALIVE')).toBeInTheDocument();
  });

  it('is_alive が false の場合、「OFFLINE」と表示される', () => {
    const offlineStatus = { ...mockStatus, is_alive: false };
    render(<LifeStatus status={offlineStatus} isLoading={false} error={null} />);
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('signal_count が表示される', () => {
    render(<LifeStatus status={mockStatus} isLoading={false} error={null} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('last_seen_at が相対時間で表示される', () => {
    render(<LifeStatus status={mockStatus} isLoading={false} error={null} />);
    expect(screen.getByText(/LAST SEEN:/)).toBeInTheDocument();
  });

  it('ローディング中はローディング表示', () => {
    render(<LifeStatus status={null} isLoading={true} error={null} />);
    expect(screen.getByText(/LOADING/)).toBeInTheDocument();
  });

  it('エラー時はエラー表示', () => {
    render(<LifeStatus status={null} isLoading={false} error="Failed to fetch" />);
    expect(screen.getByText(/ERROR/)).toBeInTheDocument();
  });
});
