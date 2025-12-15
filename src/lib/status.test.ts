/**
 * テストリスト:
 * - [x] 正常にステータスを取得できる
 * - [x] 外部APIがエラーを返した場合はエラーを返す
 * - [x] 環境変数が設定されていない場合はエラーを返す
 */

import { fetchStatus } from './status';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchStatus', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...originalEnv,
      SBYN_BASE_URL: 'https://api.example.com',
      SBYN_TOKEN: 'test-token',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('正常にステータスを取得できる', async () => {
    const mockResponse = {
      is_alive: true,
      last_seen_at: '2025-01-01T12:00:00Z',
      signal_count: 10,
      recent_signals: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          human_id: '550e8400-e29b-41d4-a716-446655440000',
          title: '朝の確認',
          created_at: '2025-01-01T12:00:00Z',
        },
      ],
      human: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'yukyu',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchStatus();

    expect(result).toEqual({ success: true, data: mockResponse });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/me/status',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer test-token',
        },
      })
    );
  });

  it('外部APIがエラーを返した場合はエラーを返す', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await fetchStatus();

    expect(result).toEqual({ success: false, error: 'Failed to fetch status' });
  });

  it('環境変数が設定されていない場合はエラーを返す', async () => {
    delete process.env.SBYN_BASE_URL;
    delete process.env.SBYN_TOKEN;

    const result = await fetchStatus();

    expect(result).toEqual({ success: false, error: 'API configuration is missing' });
  });
});
