import type { StatusResponse } from '@/types/status';

export type FetchStatusResult =
  | { success: true; data: StatusResponse }
  | { success: false; error: string };

export async function fetchStatus(): Promise<FetchStatusResult> {
  const baseUrl = process.env.SBYN_BASE_URL;
  const token = process.env.SBYN_TOKEN;

  if (!baseUrl || !token) {
    return { success: false, error: 'API configuration is missing' };
  }

  try {
    const response = await fetch(`${baseUrl}/api/v1/me/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch status' };
    }

    const data: StatusResponse = await response.json();
    return { success: true, data };
  } catch {
    return { success: false, error: 'Failed to fetch status' };
  }
}
