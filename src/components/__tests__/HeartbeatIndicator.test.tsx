/**
 * テストリスト:
 * - [x] is_alive が true の場合、「Alive」と表示される
 * - [x] is_alive が false の場合、「Offline」と表示される
 * - [x] ローディング中は「...」と表示される
 * - [x] ハートアイコンが表示される
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeartbeatIndicator } from '../HeartbeatIndicator';

describe('HeartbeatIndicator', () => {
  it('is_alive が true の場合、「Alive」と表示される', () => {
    render(<HeartbeatIndicator isAlive={true} isLoading={false} />);
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('is_alive が false の場合、「Offline」と表示される', () => {
    render(<HeartbeatIndicator isAlive={false} isLoading={false} />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('ローディング中は「...」と表示される', () => {
    render(<HeartbeatIndicator isAlive={null} isLoading={true} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('ハートアイコンが表示される', () => {
    render(<HeartbeatIndicator isAlive={true} isLoading={false} />);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });
});
